import express from "express";
import { generateCertificate } from "../controllers/certificateController.js";
import authCertificate from "../middlewares/authCertificate.js";

const Certificaterouter = express.Router();

Certificaterouter.post("/generate",authCertificate,generateCertificate)

export default Certificaterouter