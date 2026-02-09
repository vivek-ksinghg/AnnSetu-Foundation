import jwt from "jsonwebtoken";
import Volunteer from "../models/volunteer/volunteer.js";


const authVolunteer = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
  const { id } = payload;
  if (!id) throw new Error("Invalid volunteer");

  const volunteer = await Volunteer.findById(id);
  if (!volunteer) throw new Error("Volunteer doesn't exist");
  const openPaths = new Set(["/my-profile", "/update-profile", "/delete-account", "/appreciation-certificate"]);
  if (!volunteer.approved && !openPaths.has(req.path)) throw new Error("Volunteer not approved by admin");



  req.volunteer = volunteer; // attach volunteer to request
  next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export default authVolunteer;
