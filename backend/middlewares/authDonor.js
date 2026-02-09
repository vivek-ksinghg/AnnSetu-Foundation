// import jwt from "jsonwebtoken";
// import Donor from "../models/donor/Donor.js";


// const authDonor = async (req, res, next) => {
//   try {
//     const { token } =req.headers;
//     if (!token) {
//          return res.json({success:false,message:'Not Authorized Login Again'})
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const { id } = payload;
//     if (!id) throw new Error("Invalid token");

//     const donor = await Donor.findById(id);
//     if (!donor) throw new Error("Donor doesn't exist");


//     req.donor = donor; // attach donor to request
//     next();
//   } catch (err) {
//     res.status(401).send("Error: " + err.message);
//   }
// };

// export default authDonor;

import jwt from "jsonwebtoken";
import Donor from "../models/donor/donor.js";

const authDonor = async(req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = payload;
    if (!id) throw new Error("Invalid token");
    if (!payload.id) throw new Error("Invalid token");
        const donor = await Donor.findById(id);
    if (!donor) throw new Error("Donor doesn't exist");


    req.donor = donor; // attach donor to request

    req.user = payload;  // ✅ only store id + role
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export default authDonor;
