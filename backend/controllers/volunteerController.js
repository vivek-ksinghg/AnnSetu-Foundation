// VolunteerController.js
import Volunteer from "../models/volunteer/volunteer.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import Donation from "../models/donor/donation.js";
import { getCoordinatesFromAddress } from "../utils/geocode.js";
import { v2 as cloudinary } from "cloudinary";


const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT_ROUNDS = 10; // stronger hashing
const JWT_EXPIRES_IN =process.env.JWT_EXPIRES_IN || "5d"

const registerVolunteer = async (req, res) => {
  try {
    const {
      name,
      email,
      number,
      address,
      password,
      aadhaar,
      pan,
      skills,
      availability,
      assignedAreas,
    } = req.body;

    // ✅ Basic validation
    if (!name || !email || !number || !address || !password) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validator.isMobilePhone(number, "any")) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (aadhaar && !/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ error: "Invalid Aadhaar number" });
    }

    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(pan).toUpperCase())) {
      return res.status(400).json({ error: "Invalid PAN number" });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        error: "Password must be at least 8 chars with 1 uppercase, 1 lowercase, and 1 number",
      });
    }

    // ✅ Hash password
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // ✅ Save volunteer
    const volunteer = await Volunteer.create({
      name,
      email: email.toLowerCase(),
      number,
      address,
      password: hash,
      aadhaar,
      pan: pan ? String(pan).toUpperCase() : undefined,
      skills: skills ? skills.split(",").map(s => s.trim()) : [],
      availability,
      assignedAreas: assignedAreas ? assignedAreas.split(",").map(a => a.trim()) : [],
      role: "volunteer" // set role
    });
    res.status(201).json({ success: true, message: "Thanks for your application. We will review and approve.", volunteerId: volunteer._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


  // API for login

  const loginVolunteer = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Email, password, and role are required" });
    }

    let user;
    // Check role and find in corresponding collection
    if (role === "donor") {
      user = await Donor.findOne({ email });
    } else if (role === "volunteer") {
      user = await Volunteer.findOne({ email });
    } else if (role === "ngo") {
      user = await Ngo.findOne({ email });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this role" });
    }
    if (role === "volunteer" && user.approved !== true) {
      return res.status(403).json({ success: false, message: "Volunteer not approved by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({ success: true, message: "Login successful", token, user, role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export  {registerVolunteer,loginVolunteer}
 
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getNearbyDeliveryRequests = async (req, res) => {
  try {
    const volunteer = req.volunteer;
    const distanceKm = parseFloat(req.query.distanceKm || "10");
    if (!volunteer || !volunteer.address) {
      return res.status(400).json({ success: false, message: "Volunteer address not available" });
    }
    const coords = await getCoordinatesFromAddress(volunteer.address);
    if (!coords) {
      return res.status(400).json({ success: false, message: "Invalid volunteer address" });
    }
    const centerLon = coords[0];
    const centerLat = coords[1];
    const donations = await Donation.find({
      donationType: "Food",
      status: "Accepted",
      acceptedByNgo: { $ne: null },
      acceptedByVolunteer: null,
      location: { $exists: true },
    }).select("foodName foodType state quantity unit address location donor status createdAt acceptedByNgo");
    const withDistance = donations
      .filter(d => d.location && Array.isArray(d.location.coordinates))
      .map(d => {
        const [lon, lat] = d.location.coordinates;
        const distance = haversineKm(centerLat, centerLon, lat, lon);
        return { ...d.toObject(), distance };
      })
      .filter(d => isFinite(d.distance) && d.distance <= distanceKm)
      .sort((a, b) => a.distance - b.distance || b.createdAt - a.createdAt);
    res.status(200).json({ success: true, center: { lat: centerLat, lon: centerLon }, distanceKm, count: withDistance.length, data: withDistance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const acceptDeliveryRequest = async (req, res) => {
  try {
    const { donationId } = req.params;
    const volunteer = req.volunteer;
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }
    if (donation.status !== "Accepted" || !donation.acceptedByNgo) {
      return res.status(400).json({ success: false, message: "Donation not available for pickup" });
    }
    if (donation.acceptedByVolunteer) {
      return res.status(400).json({ success: false, message: "Already assigned to a volunteer" });
    }
    donation.acceptedByVolunteer = volunteer._id;
    donation.status = "PickedUp";
    await donation.save();
    const populated = await Donation.findById(donationId)
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName")
      .populate("acceptedByVolunteer", "name email");
    res.status(200).json({ success: true, message: "Delivery request accepted", data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllDeliveryRequests = async (req, res) => {
  try {
    const donations = await Donation.find({
      donationType: "Food",
      status: "Accepted",
      acceptedByNgo: { $ne: null },
      acceptedByVolunteer: null,
      location: { $exists: true },
    }).select("foodName foodType state quantity unit address location donor status createdAt acceptedByNgo")
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName");
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyDeliveryHistory = async (req, res) => {
  try {
    const volunteerId = req.volunteer?._id;
    const rows = await Donation.find({
      donationType: "Food",
      acceptedByVolunteer: volunteerId
    }).select("foodName quantity unit address status createdAt acceptedByNgo");
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const v = await Volunteer.findById(req.volunteer._id).select("-password");
    if (!v) return res.status(404).json({ success: false, message: "Volunteer not found" });
    res.status(200).json({ success: true, data: v });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const volunteerId = req.volunteer?._id;
    if (!volunteerId) return res.status(401).json({ success: false, message: "Not authorized" });

    const updates = {};
    const imageFile = req.file;
    if (imageFile?.path) {
      const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updates.image = result.secure_url;
    }

    if (req.body?.name !== undefined) {
      const name = String(req.body.name || "").trim();
      if (!name) return res.status(400).json({ success: false, message: "Name is required" });
      updates.name = name;
    }

    if (req.body?.number !== undefined) {
      const number = String(req.body.number || "").trim();
      if (!number) return res.status(400).json({ success: false, message: "Phone number is required" });
      updates.number = number;
    }

    if (req.body?.address !== undefined) {
      const address = String(req.body.address || "").trim();
      if (!address) return res.status(400).json({ success: false, message: "Address is required" });
      updates.address = address;
    }

    if (req.body?.availability !== undefined) {
      const availability = String(req.body.availability || "").trim();
      const allowed = new Set(["weekdays", "weekends", "both", ""]);
      if (!allowed.has(availability)) {
        return res.status(400).json({ success: false, message: "Invalid availability" });
      }
      updates.availability = availability || undefined;
    }

    if (req.body?.skills !== undefined) {
      const raw = req.body.skills;
      const arr = Array.isArray(raw)
        ? raw.map((s) => String(s || "").trim()).filter(Boolean)
        : String(raw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      updates.skills = arr;
    }

    if (req.body?.assignedAreas !== undefined) {
      const raw = req.body.assignedAreas;
      const arr = Array.isArray(raw)
        ? raw.map((s) => String(s || "").trim()).filter(Boolean)
        : String(raw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      updates.assignedAreas = arr;
    }

    const updated = await Volunteer.findByIdAndUpdate(volunteerId, updates, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ success: false, message: "Volunteer not found" });

    res.status(200).json({ success: true, message: "Profile updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMyAccount = async (req, res) => {
  try {
    const volunteerId = req.volunteer?._id;
    if (!volunteerId) return res.status(401).json({ success: false, message: "Not authorized" });

    const activeCount = await Donation.countDocuments({
      acceptedByVolunteer: volunteerId,
      status: { $in: ["PickedUp", "In-Progress"] },
    });
    if (activeCount > 0) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your account while you have active tasks.",
      });
    }

    const deleted = await Volunteer.findByIdAndDelete(volunteerId);
    if (!deleted) return res.status(404).json({ success: false, message: "Volunteer not found" });

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyAppreciationCertificateData = async (req, res) => {
  try {
    const volunteer = req.volunteer;
    const volunteerId = volunteer?._id;
    if (!volunteerId) return res.status(401).json({ success: false, message: "Not authorized" });

    const joinedAt = volunteer.createdAt || new Date();
    const leftAt = new Date();
    const completedCount = await Donation.countDocuments({
      acceptedByVolunteer: volunteerId,
      status: "Completed",
    });

    res.status(200).json({
      success: true,
      data: {
        volunteerName: volunteer.name || "Volunteer",
        joinedAt,
        leftAt,
        completedDeliveries: completedCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



/**
 * GET /api/volunteer/dashboard-stats
 */
export const getVolunteerDashboardStats = async (req, res) => {
  try {
    const volunteerId = req.volunteer?._id;

    const pending = await Donation.countDocuments({
      status: "Pending",
    });

    const active = await Donation.countDocuments({
      volunteer: volunteerId,
      status: { $in: ["Accepted", "In-Progress"] },
    });

    const completed = await Donation.countDocuments({
      volunteer: volunteerId,
      status: "Completed",
    });

    return res.status(200).json({
      success: true,
      data: {
        pending,
        active,
        completed,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};

// Get all active tasks for volunteer


// Get Picked Up foods for logged-in volunteer
export const getMyPickedUpFoods = async (req, res) => {
  try {
    const volunteerId = req.volunteer?._id;

    const rows = await Donation.find({
      donationType: "Food",
      acceptedByVolunteer: volunteerId,
      status: "PickedUp"
    })
      .select(
        "foodName quantity unit address status createdAt acceptedByNgo"
      );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



// update task

export const updateTaskStatus = async (req, res) => {
  try {
    const volunteerId = req.volunteer?._id;
    const { id } = req.params;
    const { status } = req.body;

    // 🔴 basic validation
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // 🔍 find donation
    const donation = await Donation.findOne({
      _id: id,
      acceptedByVolunteer: volunteerId,
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not authorized",
      });
    }

    // 🔒 only allow PickedUp → Delivered
    if (donation.status !== "PickedUp") {
      return res.status(400).json({
        success: false,
        message: `Cannot update status from ${donation.status}`,
      });
    }

    if (status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Invalid status update",
      });
    }

    // ✅ update status
    donation.status = "Delivered";
    donation.deliveredAt = new Date(); // optional but useful

    await donation.save();

    res.status(200).json({
      success: true,
      message: "Food delivered successfully",
      data: donation,
    });
  } catch (error) {
    console.error("Update Task Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
