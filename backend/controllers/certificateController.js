// import Donor from "../models/donor/donor.js";
// import Certificate from "../models/common/certificate.js";

// // @desc    Generate certificate for donor
// // @route   POST /api/certificates/generate
// // @access  Private (Donor)
// export const generateCertificate = async (req, res) => {
//   try {
//     const donor = req.donor; // comes from authCertificate middleware

//     if (!donor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Donor not found" });
//     }

//     // Last certificate generation date
//     const lastDate = donor.lastCertificateGeneratedAt;
   

//     donor.donations.forEach((d) => {
//     console.log("Donation:", d.createdAt);
//    });
    

//     // Only include donations after last certificate
//     const newDonations = lastDate
//       ? donor.donations.filter((d) => new Date(d.createdAt) > new Date(lastDate))
//       : donor.donations; // first certificate includes all
// console.log("newDonations: "+newDonations);

//     if (newDonations.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No new donations since last certificate",
//       });
//     }

//     // Calculate totals
//     let totalFoodKg = 0;
//     let totalMoney = 0;

//     newDonations.forEach((d) => {
//       totalFoodKg += d.foodKg || 0;
//       totalMoney += d.amount || 0;
//     });

//     // Create certificate record
//     const certificate = await Certificate.create({
//       donorId: donor._id,
//       donorName: donor.name,
//       donationType: "food_money",
//       totalFoodKg,
//       totalMoney,
//       fromDate: lastDate || donor.createdAt,
//       toDate: new Date(),
//       location: donor.address?.line1 || "India",
//       certificateUrl: "GENERATED_LATER",
//     });

//     // Update donor info
//   const toDate = new Date();

// // use same value everywhere
//     donor.lastCertificateGeneratedAt = toDate;
//     donor.certificates.push({
//       certificateId: certificate._id,
//       certificateUrl: certificate.certificateUrl,
//     });
//     await donor.save();

//     // Send success response like donor controller
//     res.status(201).json({
//       success: true,
//       message: "Certificate generated successfully",
//       certificateData: {
//         donorName: donor.name,
//         totalFoodKg,
//         totalMoney,
//         fromDate: certificate.fromDate,
//         toDate: certificate.toDate,
//         location: certificate.location,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error: " + error.message });
//   }
// };

import Donor from "../models/donor/donor.js";
import Certificate from "../models/common/certificate.js";
import Donation from "../models/donor/donation.js";
import mongoose from "mongoose";

// @desc Generate certificate for donor
// @route POST /api/certificates/generate
// @access Private (Donor)
export const generateCertificate = async (req, res) => {
  try {
    const donor = req.donor; // comes from auth middleware

    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }

    const lastDate = donor.lastCertificateGeneratedAt || null;
    const donorId = String(req.user?.id || donor._id);
    const query = { donor: donorId };
    if (lastDate) query.createdAt = { $gt: lastDate };

    let rawDonations = await Donation.find(query).sort({ createdAt: 1 });
    if (!rawDonations.length && mongoose.isValidObjectId(donorId)) {
      const oid = new mongoose.Types.ObjectId(donorId);
      const query2 = { ...query, donor: oid };
      rawDonations = await Donation.find(query2).sort({ createdAt: 1 });
    }
    if (!rawDonations.length && mongoose.isValidObjectId(donorId)) {
      const oid = new mongoose.Types.ObjectId(donorId);
      const mongoQuery = lastDate ? { donor: oid, createdAt: { $gt: new Date(lastDate) } } : { donor: oid };
      rawDonations = await Donation.collection
        .find(mongoQuery)
        .sort({ createdAt: 1 })
        .toArray();
    }
    if (!rawDonations.length) {
      return res.status(400).json({
        success: false,
        message: lastDate ? "No new donations since last certificate" : "No donations found",
      });
    }

    const included = rawDonations.filter((d) => {
      if (d.donationType === "Money") {
        return d.paymentStatus !== "Failed" && d.status !== "Rejected";
      }
      return d.status !== "Rejected";
    });

    if (!included.length) {
      return res.status(400).json({
        success: false,
        message: "No eligible donations found for certificate",
      });
    }

    const foodSummaryMap = new Map();
    let totalFoodKg = 0;
    let totalMoney = 0;

    for (const d of included) {
      if (d.donationType === "Money") {
        totalMoney += Number(d.amount) || 0;
        continue;
      }

      const foodName = String(d.foodName || "Food").trim();
      const unit = String(d.unit || "").trim();
      const qty = Number(d.quantity) || 0;

      const key = `${foodName}__${unit}`;
      const prev = foodSummaryMap.get(key) || { foodName, unit, quantity: 0 };
      prev.quantity += qty;
      foodSummaryMap.set(key, prev);

      if (unit === "Kg") totalFoodKg += qty;
    }

    const foodSummary = Array.from(foodSummaryMap.values()).sort((a, b) => {
      return String(a.foodName).localeCompare(String(b.foodName)) || String(a.unit).localeCompare(String(b.unit));
    });

    const fromDate = lastDate ? new Date(lastDate) : new Date(included[0].createdAt || donor.createdAt || Date.now());
    const toDate = new Date();

    const certificate = await Certificate.create({
      donorId: donor._id,
      donorName: donor.name,
      donationType: "food_money",
      totalFoodKg,
      totalMoney,
      foodSummary,
      fromDate,
      toDate,
      location: [donor.address?.line1, donor.address?.line2].filter(Boolean).join(" ") || "India",
      certificateUrl: "GENERATED_LATER",
    });

    // Update donor
    donor.lastCertificateGeneratedAt = toDate;
    donor.certificates.push({
      certificateId: certificate._id,
      certificateUrl: certificate.certificateUrl,
    });

    await donor.save();

    res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificateData: {
        donorName: donor.name,
        foodSummary,
        totalFoodKg,
        totalMoney,
        fromDate: certificate.fromDate,
        toDate: certificate.toDate,
        location: certificate.location,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};
