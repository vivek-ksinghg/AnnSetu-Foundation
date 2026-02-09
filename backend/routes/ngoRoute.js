import express from 'express'
import {getAllPendingDonations,loginNgo, registerNgo, getAllFoodDonations, getNearbyFoodDonations, acceptDonation, rejectDonation, getAcceptedMonthlyStats, getAcceptedByNgoMonthlyStats, getNearbyVolunteersForDonation, getAllVolunteers, listPublicNgos, getMoneyDonationsForNgo}  from '../controllers/ngoController.js'
import ngo from '../models/ngo/ngo.js'
import authNgo from '../middlewares/authNgo.js'



const ngoRouter=express.Router()

ngoRouter.post("/register",registerNgo)
ngoRouter.post("/login",loginNgo)


ngoRouter.get("/pending-food", getAllPendingDonations);
ngoRouter.get("/all-foods", getAllFoodDonations);
ngoRouter.get("/nearby-food/:ngoId", getNearbyFoodDonations);
// actions
ngoRouter.post("/donations/:donationId/accept", authNgo, acceptDonation);
ngoRouter.get("/donations/:donationId/nearby-volunteers", authNgo, getNearbyVolunteersForDonation);
ngoRouter.post("/donations/:donationId/reject", authNgo, rejectDonation);
// stats
ngoRouter.get("/stats/accepted-monthly", authNgo, getAcceptedMonthlyStats);
ngoRouter.get("/stats/accepted-by-ngo-monthly", authNgo, getAcceptedByNgoMonthlyStats);
ngoRouter.get("/Allvolunteers",authNgo,getAllVolunteers)

ngoRouter.get("/public-ngos", listPublicNgos)
ngoRouter.get("/money-donations", authNgo, getMoneyDonationsForNgo)


export default ngoRouter
