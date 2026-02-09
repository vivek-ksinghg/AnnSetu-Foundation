
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import NGO from '../models/ngo/ngo.js'
import Donation from "../models/donor/donation.js";
import { getCoordinatesFromAddress } from "../utils/geocode.js";
import Volunteer from "../models/volunteer/volunteer.js";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
 const JWT_EXPIRES_IN =process.env.JWT_EXPIRES_IN || "5d"

const SALT_ROUNDS = 10; // Stronger hashing

 const registerNgo = async (req, res) => {
  try {
    const {
      organizationName,
      email,
      number,
      address,
      password,
      registrationNumber,
      mission,
      website,
      contactPerson,
     
    } = req.body;

    // ✅ Basic validation
    if (!organizationName || !email || !number || !address || !password || !registrationNumber) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

       let coords = [0, 0]; // default
        // 🌍 Get coordinates
    const coordinates = await getCoordinatesFromAddress(address);
    console.log(coordinates);
    
    if (!coordinates) {
      return res.status(400).json({ error: "Unable to get coordinates for the address" });
    }

     coords = coordinates;

//     if (
//   !coordinates ||
//   coordinates.lat === null ||
//   coordinates.lng === null ||
//   isNaN(coordinates.lat) ||
//   isNaN(coordinates.lng)
// ) {
//   return res.status(400).json({
//     error: "Invalid address — unable to fetch valid coordinates. Please enter a proper location.",
//   });
// }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validator.isMobilePhone(number, "any")) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
      })
    ) {
      return res.status(400).json({
        error: "Password must be at least 8 chars with 1 uppercase, 1 lowercase, and 1 number"
      });
    }

      // ✅ Check if NGO already exists by email or registrationNumber
    // 🔥 Added this check
    const existingNgo = await NGO.findOne({
      $or: [{ email: email.toLowerCase() }, { registrationNumber }],
    });
    if (existingNgo) {
      return res.status(400).json({ error: "NGO with this email or registration number already exists" });
    }

    // ✅ Hash password
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // ✅ Save NGO
    const newNgo= await NGO.create({
      organizationName,
      email: email.toLowerCase(),
      number,
      address,
      password: hash,
      registrationNumber,
      mission,
      website,
      contactPerson,
      role: "ngo",

    location: {
    type: "Point",
    coordinates: coords, // Already [lng, lat]
  },
    });
   
    res.status(201).json({ success: true, message: "Thanks for your application. We will review and approve.", ngoId: newNgo._id });

  } catch (err) {
    // Duplicate email error handling
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: err.message });
  }
};

  // API for login

  const loginNgo = async (req, res) => {
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
      user = await NGO.findOne({ email });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this role" });
    }
    if (role === "ngo" && user.approved !== true) {
      return res.status(403).json({ success: false, message: "NGO not approved by admin" });
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

    // res.status(200).json({ success: true, message: "Login successful", token, user, role });
    res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  ngo: user, // ✅ rename to ngo
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// ntofy all volunteer for new food accepted by ngo
// 🔔 Notify all approved volunteers when NGO accepts food
const notifyApprovedVolunteersByEmail = async ({ donation, ngo }) => {
  try {
    const gmailUser = String(process.env.GMAIL_USER || "").replace(/^['"]|['"]$/g, "");
    const gmailPass = String(process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

    if (!gmailUser || !gmailPass) return;

    const volunteers = await Volunteer.find({ approved: true }).select("email");
    const bcc = volunteers
      .map((v) => String(v.email || "").trim())
      .filter((e) => e.includes("@"));

    if (bcc.length === 0) return;

    const subject = "Food Donation Accepted – Volunteer Action Needed";

    const pickupAddress =
      typeof donation.address === "string"
        ? donation.address
        : donation?.address?.line1 || donation?.address?.line2 || "N/A";
    const text =
      `Hello Volunteer,\n\n` +
      `A food donation has just been accepted by an NGO on AnnSetu Foundation.\n\n` +
      `Food Name: ${donation.foodName || "N/A"}\n` +
      `Quantity: ${donation.quantity || "N/A"} ${donation.unit || ""}\n` +
      `Accepted By NGO: ${ngo.organizationName}\n` +
      `Pickup Address: ${pickupAddress}\n\n` +
      `You need to pick up this food if you are available.\n` +
      `Please log in to the platform and accept the delivery request.\n\n` +
      `Thank you for supporting the mission.\n` +
      `AnnSetu Foundation`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `AnnSetu Foundation <${gmailUser}>`,
      to: gmailUser,
      bcc,
      subject,
      text,
    });

  } catch (error) {
    console.error("Volunteer mail error:", error.message);
  }
};



// ✅ Get all pending donations without distance filter
 const getAllPendingDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donationType: "Food",
      status: "Pending"
    }).populate("donor", "name email"); // optional

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });

  } catch (error) {
    console.error("Error fetching pending food donations:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


export  {registerNgo,loginNgo,getAllPendingDonations}
 
// Haversine distance in km
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

// All food donations (any status)
export const getAllFoodDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donationType: "Food" })
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName");
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getAcceptedByNgoMonthlyStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          donationType: "Food",
          status: "Accepted",
          acceptedByNgo: { $ne: null }
        }
      },
      {
        $group: {
          _id: {
            ym: { $dateToString: { format: "%Y-%m", date: "$updatedAt" } },
            ngo: "$acceptedByNgo"
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "ngos",
          localField: "_id.ngo",
          foreignField: "_id",
          as: "ngo"
        }
      },
      { $unwind: "$ngo" },
      {
        $project: {
          _id: 0,
          month: "$_id.ym",
          ngoId: "$_id.ngo",
          ngoName: "$ngo.organizationName",
          count: 1
        }
      },
      { $sort: { month: 1, ngoName: 1 } }
    ];
    const rows = await Donation.aggregate(pipeline);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
// Nearby food donations within distanceKm from NGO location
export const getNearbyFoodDonations = async (req, res) => {
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

export const getNearbyVolunteersForDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const distanceKm = parseFloat(req.query.distanceKm || "10");
    if (!donationId) {
      return res.status(400).json({ success: false, message: "Donation ID is required" });
    }
    const donation = await Donation.findById(donationId).select("address location");
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }
    let centerLon = null;
    let centerLat = null;
    if (donation.location && Array.isArray(donation.location.coordinates) && donation.location.coordinates[0] !== 0 && donation.location.coordinates[1] !== 0) {
      centerLon = donation.location.coordinates[0];
      centerLat = donation.location.coordinates[1];
    } else if (donation.address) {
      const coords = await getCoordinatesFromAddress(donation.address);
      if (!coords) {
        return res.status(400).json({ success: false, message: "Invalid donation address" });
      }
      centerLon = coords[0];
      centerLat = coords[1];
    } else {
      return res.status(400).json({ success: false, message: "Donation address not available" });
    }
    const volunteers = await Volunteer.find({ approved: true }).select("name email number address skills availability assignedAreas");
    const results = [];
    for (const v of volunteers) {
      if (!v.address) continue;
      const coords = await getCoordinatesFromAddress(v.address);
      if (!coords) continue;
      const lon = coords[0];
      const lat = coords[1];
      const dist = haversineKm(centerLat, centerLon, lat, lon);
      if (isFinite(dist) && dist <= distanceKm) {
        results.push({ ...v.toObject(), distance: dist, location: { lat, lon } });
      }
    }
    results.sort((a, b) => a.distance - b.distance);
    return res.status(200).json({
      success: true,
      center: { lat: centerLat, lon: centerLon },
      distanceKm,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
// Update donation status by NGO: Accept
// export const acceptDonation = async (req, res) => {
//   console.log("accept donation hit");
  
//   try {
//     const { donationId } = req.params;
//     if (!donationId) {
//       return res.status(400).json({ success: false, message: "Donation ID is required" });
//     }
//     const donation = await Donation.findById(donationId);
//     if (!donation) {
//       return res.status(404).json({ success: false, message: "Donation not found" });
//     }
//     if (donation.status !== "Pending") {
//       return res.status(400).json({ success: false, message: `Cannot accept a donation in '${donation.status}' state` });
//     }
//     donation.status = "Accepted";
//     donation.acceptedByNgo = req.ngo?._id || null;
//     await donation.save();
//  // all volunteer 
//  if(donation.status=="Accepted"){
//   console.log("enter in function");
  
//      notifyApprovedVolunteersByEmail({
//       donation,
//       ngo: req.ngo,
//     }).catch(() => {});
//   }

//     const populated = await Donation.findById(donationId)
//       .populate("donor", "name email")
//       .populate("acceptedByNgo", "organizationName");
//     return res.status(200).json({ success: true, message: "Donation accepted", data: populated });
//   } catch (error) {
//     console.error("Accept donation error:", error);
//     return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// Update donation status by NGO: Accept
export const acceptDonation = async (req, res) => {
  console.log("✅ acceptDonation API hit");

  try {
    const { donationId } = req.params;

    // 1️⃣ Validate donationId
    if (!donationId) {
      return res.status(400).json({
        success: false,
        message: "Donation ID is required",
      });
    }

    // 2️⃣ Fetch donation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // 3️⃣ Allow only Pending donations
    if (donation.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot accept donation in '${donation.status}' state`,
      });
    }

    // 4️⃣ Fetch NGO safely from DB (IMPORTANT FIX)
    const ngo = await NGO.findById(req.ngo?._id);
    if (!ngo) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized NGO",
      });
    }

    // 5️⃣ Update donation
    donation.status = "Accepted";
    donation.acceptedByNgo = ngo._id;
    await donation.save();

    console.log("✅ Donation accepted, sending volunteer emails...");

    // 6️⃣ Notify all approved volunteers (NON-BLOCKING)
    notifyApprovedVolunteersByEmail({
      donation,
      ngo,
    }).catch((err) => {
      console.error("❌ Volunteer mail failed:", err.message);
    });

    // 7️⃣ Send response with populated data
    const populatedDonation = await Donation.findById(donationId)
      .populate("donor", "name email")
      .populate("acceptedByNgo", "organizationName");

    return res.status(200).json({
      success: true,
      message: "Donation accepted successfully",
      data: populatedDonation,
    });

  } catch (error) {
    console.error("❌ Accept donation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// Update donation status by NGO: Reject
export const rejectDonation = async (req, res) => {
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
      return res.status(400).json({ success: false, message: `Cannot reject a donation in '${donation.status}' state` });
    }
    await Donation.findByIdAndDelete(donationId);
    return res.status(200).json({ success: true, message: "Donation deleted" });
  } catch (error) {
    console.error("Reject donation error:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getAcceptedMonthlyStats = async (req, res) => {
  try {
    const ngoId = req.ngo?._id;
    if (!ngoId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const pipeline = [
      {
        $match: {
          donationType: "Food",
          status: "Accepted",
          acceptedByNgo: ngoId
        }
      },
      {
        $group: {
          _id: {
            ym: { $dateToString: { format: "%Y-%m", date: "$updatedAt" } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.ym": 1 } }
    ];
    const agg = await Donation.aggregate(pipeline);
    const data = agg.map((a) => ({
      month: a._id.ym,
      count: a.count
    }));
    res.status(200).json({ success: true, data, total: data.reduce((s, d) => s + d.count, 0) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .select("name email number address createdAt");

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteers",
    });
  }
};


export const listPublicNgos = async (req, res) => {
  try {
    const ngos = await NGO.find({ approved: true })
      .select("_id organizationName approved");
    res.status(200).json({ success: true, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


export const getMoneyDonationsForNgo = async (req, res) => {
  try {
    const ngoId = req.ngo?._id;
    if (!ngoId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    const donations = await Donation.find({ donationType: "Money", acceptedByNgo: ngoId })
      .sort({ createdAt: -1 })
      .populate("donor", "name email");
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
