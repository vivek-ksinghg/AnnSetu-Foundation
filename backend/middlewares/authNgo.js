import jwt from "jsonwebtoken";
import NGO from "../models/ngo/ngo.js";


const authNgo= async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) throw new Error("Ngo not authroized");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
  const { id } = payload;
  if (!id) throw new Error("Invalid ngo");

  const ngo = await NGO.findById(id);
  if (!ngo) throw new Error("NGO doesn't exist");
  if (!ngo.approved) throw new Error("NGO not approved by admin");


  req.ngo = ngo; // attach NGO to request
  next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

export default authNgo;
