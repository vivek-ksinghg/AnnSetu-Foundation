import jwt from "jsonwebtoken";
import Admin from "../models/admin/admin.js";

const authAdmin = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) throw new Error("Admin not authorized");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = payload;
    if (!id || role !== "admin") throw new Error("Invalid admin token");

    const admin = await Admin.findById(id);
    if (!admin) throw new Error("Admin doesn't exist");

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

export default authAdmin;

