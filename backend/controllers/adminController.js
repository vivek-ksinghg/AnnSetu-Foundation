import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin/admin.js";
import NGO from "../models/ngo/ngo.js";
import Volunteer from "../models/volunteer/volunteer.js";
import Donation from "../models/donor/donation.js";
import Donor from "../models/donor/Donor.js";
import { getCoordinatesFromAddress } from "../utils/geocode.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "5d";
const SALT_ROUNDS = 10;

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    let admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      if (email.toLowerCase() === "admin@gmail.com") {
        const hash = await bcrypt.hash("qwert1234", SALT_ROUNDS);
        admin = await Admin.create({ email: "admin@gmail.com", password: hash, role: "admin" });
      } else {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role, email: admin.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
    return res.status(200).json({ success: true, token, admin });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listPendingNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ approved: false }).select("-password");
    res.status(200).json({ success: true, count: ngos.length, data: ngos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listPendingVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ approved: false }).select("-password");
    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveNgo = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await NGO.findByIdAndUpdate(id, { approved: true }, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ success: false, message: "NGO not found" });
    res.status(200).json({ success: true, message: "NGO approved", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Volunteer.findByIdAndUpdate(id, { approved: true }, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ success: false, message: "Volunteer not found" });
    res.status(200).json({ success: true, message: "Volunteer approved", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNgo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NGO.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "NGO not found" });
    res.status(200).json({ success: true, message: "NGO deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// all listing ngo
export const getAllNgos = async (req, res) => {
  try {
    const ngos = await NGO.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ngos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch NGOs",
    });
  }
};

// get all volunteers
export const getAllVolunteer = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: volunteers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteers",
    });
  }
};

// get all donors

// get all donors
export const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: donors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donors",
    });
  }
};

// delete donor 
// DELETE donor (admin)
export const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Check donor exists
    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // 2️⃣ Delete ALL pending donations by this donor
    const deletedDonations = await Donation.deleteMany({
      donor: id,
      status: "Pending", // 🔥 ONLY pending
    });

    // 3️⃣ Delete donor
    await Donor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Donor deleted successfully",
      deletedPendingDonations: deletedDonations.deletedCount,
    });

  } catch (error) {
    console.error("Delete donor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete donor",
    });
  }
};

export const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Volunteer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Volunteer not found" });
    res.status(200).json({ success: true, message: "Volunteer deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateNgo = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = { ...req.body };
    delete allowed.password;
    const updated = await NGO.findByIdAndUpdate(id, allowed, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ success: false, message: "NGO not found" });
    res.status(200).json({ success: true, message: "NGO updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = { ...req.body };
    delete allowed.password;
    const updated = await Volunteer.findByIdAndUpdate(id, allowed, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ success: false, message: "Volunteer not found" });
    res.status(200).json({ success: true, message: "Volunteer updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName")
      .populate("acceptedByVolunteer", "name email");
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listMoneyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donationType: "Money" })
      .sort({ createdAt: -1 })
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName");
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Donation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Donation not found" });
    res.status(200).json({ success: true, message: "Donation deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const stats = async (req, res) => {
  try {
    const [ngoCount, volunteerCount, donorCount, donationCount, pendingNgos, pendingVolunteers] =
      await Promise.all([
        NGO.countDocuments({}),
        Volunteer.countDocuments({}),
        Donor.countDocuments({}),
        Donation.countDocuments({}),
        NGO.countDocuments({ approved: false }),
        Volunteer.countDocuments({ approved: false }),
      ]);
    res.status(200).json({
      success: true,
      data: {
        ngos: ngoCount,
        volunteers: volunteerCount,
        donors: donorCount,
        donations: donationCount,
        pendingNgos,
        pendingVolunteers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== Admin access to NGO features =====

export const adminPendingFood = async (req, res) => {
  try {
    const donations = await Donation.find({
      donationType: "Food",
      status: "Pending",
    }).populate("donor", "name email");
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const adminAllFoods = async (req, res) => {
  try {
    const donations = await Donation.find({ donationType: "Food" })
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName");
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

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

export const adminNearbyFoods = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const distanceKm = parseFloat(req.query.distanceKm || "10");
    const address = typeof req.query.address === "string" ? req.query.address.trim() : "";
    const hasLat = req.query.lat !== undefined;
    const hasLon = req.query.lon !== undefined;

    let centerLon = null;
    let centerLat = null;

    if (address || (hasLat && hasLon)) {
      if (address) {
        const coords = await getCoordinatesFromAddress(address);
        if (!coords) {
          return res.status(400).json({ success: false, message: "Invalid address" });
        }
        centerLon = coords[0];
        centerLat = coords[1];
      } else {
        const lonNum = parseFloat(String(req.query.lon));
        const latNum = parseFloat(String(req.query.lat));
        if (!isFinite(lonNum) || !isFinite(latNum)) {
          return res.status(400).json({ success: false, message: "Invalid coordinates" });
        }
        centerLon = lonNum;
        centerLat = latNum;
      }
    } else {
      const ngo = await NGO.findById(ngoId);
      if (!ngo || !ngo.location || !ngo.location.coordinates) {
        return res.status(404).json({ success: false, message: "NGO location not found" });
      }
      centerLon = ngo.location.coordinates[0];
      centerLat = ngo.location.coordinates[1];
    }

    const donations = await Donation.find({
      donationType: "Food",
      status: { $in: ["Pending", "Accepted", "PickedUp"] },
      location: { $exists: true },
    }).select("foodName foodType state quantity unit address location donor status createdAt acceptedByNgo")
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName");

    const withDistance = donations
      .filter(d => d.location && Array.isArray(d.location.coordinates))
      .map(d => {
        const [lon, lat] = d.location.coordinates;
        const distance = haversineKm(centerLat, centerLon, lat, lon);
        return { ...d.toObject(), distance };
      })
      .filter(d => isFinite(d.distance) && d.distance <= distanceKm)
      .sort((a, b) => a.distance - b.distance || b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      ngoLocation: { lat: centerLat, lon: centerLon },
      distanceKm,
      count: withDistance.length,
      data: withDistance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const adminAcceptDonationForNgo = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { ngoId } = req.body;
    if (!donationId || !ngoId) {
      return res.status(400).json({ success: false, message: "Donation ID and NGO ID are required" });
    }
    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });
    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });
    if (donation.status !== "Pending") {
      return res.status(400).json({ success: false, message: `Cannot accept donation in '${donation.status}' state` });
    }
    donation.status = "Accepted";
    donation.acceptedByNgo = ngo._id;
    await donation.save();
    const populated = await Donation.findById(donationId)
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName");
    return res.status(200).json({ success: true, message: "Donation accepted for NGO", data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const adminRejectDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    if (!donationId) {
      return res.status(400).json({ success: false, message: "Donation ID is required" });
    }
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }
    if (donation.status !== "Pending") {
      return res.status(400).json({ success: false, message: `Cannot reject donation in '${donation.status}' state` });
    }
    await Donation.findByIdAndDelete(donationId);
    return res.status(200).json({ success: true, message: "Donation deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
