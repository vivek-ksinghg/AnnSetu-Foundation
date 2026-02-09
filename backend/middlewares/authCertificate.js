// import jwt from "jsonwebtoken";
// import Donor from "../models/donor/donor.js"

// const authCertificate = async (req, res, next) => {
//   try {
//     const { token } = req.headers; // read token from frontend
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token found. Please login again.",
//       });
//     }

//     // verify token
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const { id } = payload;

//     if (!id) throw new Error("Invalid token");

//     // find donor in DB
//     const donor = await Donor.findById(id);
//     if (!donor) throw new Error("Donor doesn't exist");

//     // attach donor to request
//     req.donor = donor; // full donor object for certificate generation
//     req.user = { id: donor._id }; // optional: store minimal info

//     next();
//   } catch (err) {
//     res.status(401).json({ success: false, message: err.message });
//   }
// };

// export default authCertificate;

import jwt from "jsonwebtoken";
import Donor from "../models/donor/donor.js";

const authCertificate = async (req, res, next) => {
  try {
    // ✅ read token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token found. Please login again.",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = payload;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // find donor
    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(401).json({
        success: false,
        message: "Donor does not exist",
      });
    }

    // attach donor
    req.donor = donor;
    req.user = payload;

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authCertificate;
