import express from "express";
import { getImpactStats } from "../controllers/publicController.js";

const publicRouter = express.Router();

publicRouter.get("/impact-stats", getImpactStats);

export default publicRouter;

