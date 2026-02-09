import express from "express";
import {
  loginAdmin,
  listPendingNGOs,
  listPendingVolunteers,
  approveNgo,
  approveVolunteer,
  deleteNgo,
  deleteVolunteer,
  updateNgo,
  updateVolunteer,
  listAllDonations,
  listMoneyDonations,
  deleteDonation,
  stats,
  getAllNgos,
  getAllVolunteer,
  getAllDonors,
  deleteDonor
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
  adminPendingFood,
  adminAllFoods,
  adminNearbyFoods,
  adminAcceptDonationForNgo,
  adminRejectDonation,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/_debug", (req, res) => res.send("admin router ok"));
adminRouter.get("/stats", authAdmin, stats);

adminRouter.get("/pending/ngos", authAdmin, listPendingNGOs);
adminRouter.get("/pending/volunteers", authAdmin, listPendingVolunteers);

adminRouter.patch("/ngos/:id/approve", authAdmin, approveNgo);
adminRouter.patch("/volunteers/:id/approve", authAdmin, approveVolunteer);

adminRouter.get("/AllNgo",authAdmin,getAllNgos)
adminRouter.delete("/ngos/:id", authAdmin, deleteNgo);
adminRouter.get("/AllVolunteer",authAdmin,getAllVolunteer)
adminRouter.delete("/volunteers/:id", authAdmin, deleteVolunteer);
adminRouter.delete("/donors/:id", authAdmin, deleteDonor);
adminRouter.get("/AllDonor", authAdmin, getAllDonors);
adminRouter.patch("/ngos/:id", authAdmin, updateNgo);
adminRouter.patch("/volunteers/:id", authAdmin, updateVolunteer);

adminRouter.get("/donations", authAdmin, listAllDonations);
adminRouter.get("/money-donations", authAdmin, listMoneyDonations);
adminRouter.delete("/donations/:id", authAdmin, deleteDonation);

// NGO feature access for admin
adminRouter.get("/ngo/pending-food", authAdmin, adminPendingFood);
adminRouter.get("/ngo/all-foods", authAdmin, adminAllFoods);
adminRouter.get("/ngo/nearby-food/:ngoId", authAdmin, adminNearbyFoods);
adminRouter.post("/ngo/donations/:donationId/accept", authAdmin, adminAcceptDonationForNgo);
adminRouter.post("/ngo/donations/:donationId/reject", authAdmin, adminRejectDonation);

export default adminRouter;
