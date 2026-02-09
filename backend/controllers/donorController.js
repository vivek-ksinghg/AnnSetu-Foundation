import Donor from "../models/donor/donor.js";
import Donation from "../models/donor/donation.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {v2 as cloudinary} from 'cloudinary'
import { getCoordinatesFromAddress } from "../utils/geocode.js";
import NGO from '../models/ngo/ngo.js'
import crypto from "crypto";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";


  const JWT_SECRET = process.env.JWT_SECRET || "secret";
  const JWT_EXPIRES_IN =process.env.JWT_EXPIRES_IN || "5d"

  const SALT_ROUNDS = 10;

  const notifyApprovedNgosByEmail = async ({ donationType, amount, donorName, ngoName }) => {
    const gmailUser = String(process.env.GMAIL_USER || "").replace(/^['"]|['"]$/g, "");
    const gmailPassRaw = String(process.env.GMAIL_APP_PASSWORD || "").replace(/^['"]|['"]$/g, "");
    const gmailPass = gmailPassRaw.replace(/\s+/g, "");
    if (!gmailUser || !gmailPass) return;

    const ngos = await NGO.find({ approved: true }).select("email organizationName");
    const bcc = ngos
      .map((n) => String(n.email || "").trim())
      .filter((e) => e.includes("@"));
    if (bcc.length === 0) return;

    const safeType = donationType === "Food" ? "Food" : "Money";
    const subject = `New Donation Alert: ${safeType} Donation`;
    const amountLine = safeType === "Money" && isFinite(Number(amount)) ? `Donation Amount: ₹${Number(amount)}\n` : "";
    const ngoLine = ngoName ? `Selected NGO: ${ngoName}\n` : "";
    const donorLine = donorName ? `Donor: ${donorName}\n` : "";

    const text =
      `Hello,\n\n` +
      `A new donation has been created on AnnSetu Foundation.\n\n` +
      `Donation Type: ${safeType}\n` +
      amountLine +
      ngoLine +
      donorLine +
      `Please log in to the platform to review the donation details and take the required action.\n\n` +
      `Thank you,\n` +
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
  };

  const getRazorpayClient = () => {
    const keyId = String(process.env.RAZORPAY_KEY_ID || "").replace(/^['"]|['"]$/g, "");
    const keySecret = String(process.env.RAZORPAY_KEY_SECRET || "").replace(/^['"]|['"]$/g, "");
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys not configured");
    }
    return {
      client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
      keyId,
      keySecret,
    };
  };

  const registerDonor = async (req, res) => {
    try {
      const { name, email, phone, address, gender, birthday, password } = req.body;
      
      // Basic validation
      if (!name || !email || !phone || !address || !password) {
        return res.status(400).json({ error: "All required fields must be filled" });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      if (!validator.isMobilePhone(phone, "any")) {
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

      // Check if email already exists
      const existingDonor = await Donor.findOne({ email: email.toLowerCase() });
      if (existingDonor) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      // Save donor
      const donor = await Donor.create({
        name,
        email: email.toLowerCase(),
        phone,
        address,
        gender,
        birthday,
        password: hash,
        role: "donor"
      });

      const token = jwt.sign({ id: donor._id, role: donor.role, email: donor.email }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

      res.status(201).json({
       success: true,
       message: "Donor registered successfully",
       token,
      user: {
      id: donor._id,
      name: donor.name,
      email: donor.email,
      phone: donor.phone,
      role: donor.role
     }
});
      } catch (err) {
       res.status(500).json({ error: err.message });
      }
  };

  // API for login

  const loginUser = async (req, res) => {
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

   // ✅ CHANGE HERE
res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Controller to add a donation
 const addDonation = async (req, res) => {
  try {
    const donorId = req.donor?._id; // assuming donorMiddleware attached donor to req
    if (!donorId) return res.status(401).json({ success: false, message: "Not authorized" });

    const {
      donationType,
      foodName,
      foodType,
      state,
      quantity,
      unit,
     address,
      amount,
      paymentMethod,
      transactionId,
    } = req.body;

    // Basic validation
    if (!donationType || !["Food", "Money"].includes(donationType)) {
      return res.status(400).json({ success: false, message: "Invalid donation type" });
    }

    let coords = [0, 0]; // default

    if (donationType === "Food") {
      if (!address) {
        return res
          .status(400)
          .json({ success: false, message: "Address is required" });
      }

      const location = await getCoordinatesFromAddress(address);
  
      
      if (!location)
        return res.status(400).json({ success: false, message: "Invalid address" });

      coords = location; // 🔴 FIX: geocode.js already returns [lng, lat]
      console.log("🟢 Coordinates fetched:", coords);
    }

    if (donationType === "Food") {
      if (!foodName || !foodType || !state || !quantity || !unit || !address) {
        return res.status(400).json({ success: false, message: "All food fields are required" });
      }
      if (!["Veg", "Non-Veg"].includes(foodType)) {
        return res.status(400).json({ success: false, message: "Invalid food type" });
      }
      if (!["Cooked", "Raw"].includes(state)) {
        return res.status(400).json({ success: false, message: "Invalid food state" });
      }
      if (!["Packets", "Kg", "Liters", "Plates"].includes(unit)) {
        return res.status(400).json({ success: false, message: "Invalid unit" });
      }
    }

    if (donationType === "Money") {
      if (!amount || !paymentMethod || !transactionId) {
        return res.status(400).json({ success: false, message: "All money fields are required" });
      }
      if (!["UPI", "Card", "NetBanking", "Cash"].includes(paymentMethod)) {
        return res.status(400).json({ success: false, message: "Invalid payment method" });
      }
    }

    // Create donation
    const donation = await Donation.create({
      donor: donorId,
      donationType,
      foodName: donationType === "Food" ? foodName : undefined,
      foodType: donationType === "Food" ? foodType : undefined,
      state: donationType === "Food" ? state : undefined,
      quantity: donationType === "Food" ? quantity : undefined,
      unit: donationType === "Food" ? unit : undefined,
      address: donationType === "Food" ? address : undefined,
      location: donationType === "Food" ? { type: "Point", coordinates: coords } : undefined,
  

       // if money
      amount: donationType === "Money" ? amount : undefined,
      paymentMethod: donationType === "Money" ? paymentMethod : undefined,
      transactionId: donationType === "Money" ? transactionId : undefined,
    });

    if (donationType === "Food") {
      notifyApprovedNgosByEmail({
        donationType: "Food",
        donorName: req.donor?.name,
      }).catch(() => {});
    }

    res.status(201).json({ success: true, message: "Donation added successfully", donation });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const createRazorpayOrder = async (req, res) => {
  try {
    const donorId = req.donor?._id;
    if (!donorId) return res.status(401).json({ success: false, message: "Not authorized" });

    const amount = Number(req.body?.amount);
    const ngoId = String(req.body?.ngoId || "").trim();
    if (!isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    if (!ngoId) {
      return res.status(400).json({ success: false, message: "NGO is required" });
    }

    const ngo = await NGO.findById(ngoId).select("_id organizationName approved");
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });
    if (!ngo.approved) return res.status(400).json({ success: false, message: "NGO not approved" });

    const { client, keyId } = getRazorpayClient();
    const receipt = `d_${String(donorId).slice(-6)}_${Date.now()}`.slice(0, 40);
    const order = await client.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      notes: { donorId: String(donorId), ngoId: String(ngo._id), ngoName: ngo.organizationName || "" },
    });

    await Donation.create({
      donor: donorId,
      donationType: "Money",
      amount,
      paymentMethod: "Razorpay",
      razorpayOrderId: order.id,
      paymentStatus: "Created",
      status: "Pending",
      acceptedByNgo: ngo._id,
      ngoName: ngo.organizationName || "",
    });

    res.status(200).json({ success: true, keyId, order });
  } catch (err) {
    const msg =
      err?.message ||
      err?.error?.description ||
      err?.error?.reason ||
      err?.error?.code ||
      "Failed to create Razorpay order";
    res.status(500).json({ success: false, message: msg });
  }
};


const verifyRazorpayPaymentAndCreateDonation = async (req, res) => {
  try {
    const donorId = req.donor?._id;
    if (!donorId) return res.status(401).json({ success: false, message: "Not authorized" });

    const amount = Number(req.body?.amount);
    const ngoId = String(req.body?.ngoId || "").trim();
    const orderId = String(req.body?.razorpay_order_id || "").trim();
    const paymentId = String(req.body?.razorpay_payment_id || "").trim();
    const signature = String(req.body?.razorpay_signature || "").trim();

    if (!isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    if (!ngoId) {
      return res.status(400).json({ success: false, message: "NGO is required" });
    }
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const { keySecret } = getRazorpayClient();
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expected !== signature) {
      await Donation.findOneAndUpdate(
        { donor: donorId, donationType: "Money", razorpayOrderId: orderId },
        { $set: { paymentStatus: "Failed", status: "Rejected" } },
        { new: true }
      );
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const ngo = await NGO.findById(ngoId).select("_id organizationName");
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

    const already = await Donation.findOne({ donationType: "Money", transactionId: paymentId });
    if (already) {
      return res.status(200).json({ success: true, message: "Already recorded", donation: already });
    }

    const updated = await Donation.findOneAndUpdate(
      { donor: donorId, donationType: "Money", razorpayOrderId: orderId },
      {
        $set: {
          amount,
          paymentMethod: "Razorpay",
          transactionId: paymentId,
          razorpayPaymentId: paymentId,
          paymentStatus: "Success",
          status: "Completed",
          acceptedByNgo: ngo._id,
          ngoName: ngo.organizationName || "",
        },
      },
      { new: true }
    );

    const donation = updated
      ? updated
      : await Donation.create({
          donor: donorId,
          donationType: "Money",
          amount,
          paymentMethod: "Razorpay",
          transactionId: paymentId,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          paymentStatus: "Success",
          status: "Completed",
          acceptedByNgo: ngo._id,
          ngoName: ngo.organizationName || "",
        });

    notifyApprovedNgosByEmail({
      donationType: "Money",
      amount,
      donorName: req.donor?.name,
      ngoName: ngo.organizationName || "",
    }).catch(() => {});

    res.status(201).json({ success: true, message: "Payment verified", donation });
  } catch (err) {
    const msg =
      err?.message ||
      err?.error?.description ||
      err?.error?.reason ||
      err?.error?.code ||
      "Payment verification failed";
    res.status(500).json({ success: false, message: msg });
  }
};


const markRazorpayPaymentFailed = async (req, res) => {
  try {
    const donorId = req.donor?._id;
    if (!donorId) return res.status(401).json({ success: false, message: "Not authorized" });

    const orderId = String(req.body?.razorpay_order_id || "").trim();
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order id is required" });
    }

    const ngoId = String(req.body?.ngoId || "").trim();
    const amount = Number(req.body?.amount);
    const ngo = ngoId ? await NGO.findById(ngoId).select("_id organizationName") : null;

    const updated = await Donation.findOneAndUpdate(
      { donor: donorId, donationType: "Money", razorpayOrderId: orderId },
      {
        $set: {
          amount: isFinite(amount) && amount > 0 ? amount : undefined,
          paymentMethod: "Razorpay",
          paymentStatus: "Failed",
          status: "Rejected",
          acceptedByNgo: ngo?._id || undefined,
          ngoName: ngo?.organizationName || undefined,
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Marked failed", donation: updated || null });
  } catch (err) {
    const msg =
      err?.message ||
      err?.error?.description ||
      err?.error?.reason ||
      err?.error?.code ||
      "Failed to mark payment as failed";
    res.status(500).json({ success: false, message: msg });
  }
};

const listApprovedNgosForDonation = async (req, res) => {
  try {
    const ngos = await NGO.find({ approved: true }).select("_id organizationName approved");
    res.status(200).json({ success: true, data: ngos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


 const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware after JWT verification
  const userId = req.user.id;
  const role = req.user.role;
 

    let profile;

    if (role === "donor") {
      profile = await Donor.findById(userId).select("-password");
    } else if (role === "ngo") {
      profile = await NGO.findById(userId).select("-password");
    } else if (role === "volunteer") {
      profile = await Volunteer.findById(userId).select("-password");
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile
    });

  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// EDIT PRPFILE
const updateProfile = async (req, res) => {
  try {
    const donorId = req.user.id;

    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    // Handle address safely
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch {
        parsedAddress = address; // keep as plain string if parsing fails
      }
    }

    // Prepare update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;
    if (address) updateData.address = parsedAddress;

    // Upload image if provided
   if (imageFile) {
  try {
    const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    updateData.image = result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    return res.status(500).json({ success: false, message: "Image upload failed" });
  }
}


    // Update user
    const updatedUser = await Donor
      .findByIdAndUpdate(donorId, updateData, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.json({ success: false, message: error.message });
  }
};


// Get all available foods
  const getAllDonatedFoods = async (req, res) => {
    try {
      const foods = await Donation.find({ donationType: "Food" });
  
      return res.status(200).json({ foods }); // empty array if none
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  };


 // Controller to get all donations for logged-in donor
 const myDonation = async (req, res) => {
  try {
    const donorId = req.user.id; // assume ye middleware se aa raha hai

    // Sirf donor ke donations fetch karenge
    const donations = await Donation.find({ donor: donorId })
      .sort({ createdAt: -1 })
      .populate("acceptedByNgo", "organizationName");

    res.json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ success: false, message: "Error fetching donations" });
  }
};


  export  {registerDonor,loginUser,addDonation,getProfile,updateProfile,getAllDonatedFoods,myDonation, createRazorpayOrder, verifyRazorpayPaymentAndCreateDonation, markRazorpayPaymentFailed, listApprovedNgosForDonation}; 
