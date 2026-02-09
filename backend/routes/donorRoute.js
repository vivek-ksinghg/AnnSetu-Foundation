import express from 'express'
import {registerDonor,loginUser, addDonation, getProfile, updateProfile,getAllDonatedFoods, myDonation, createRazorpayOrder, verifyRazorpayPaymentAndCreateDonation, markRazorpayPaymentFailed, listApprovedNgosForDonation} from '../controllers/donorController.js'
import authDonor from '../middlewares/authDonor.js'
import upload from '../middlewares/multer.js'
import { loginAdmin } from '../controllers/adminController.js'


const donorRouter=express.Router()

donorRouter.post("/register",registerDonor)
donorRouter.post('/login',loginUser)
donorRouter.post('/admin/login', loginAdmin)
donorRouter.post('/addDonation',authDonor,addDonation)
donorRouter.post('/razorpay/order', authDonor, createRazorpayOrder)
donorRouter.post('/razorpay/verify', authDonor, verifyRazorpayPaymentAndCreateDonation)
donorRouter.post('/razorpay/fail', authDonor, markRazorpayPaymentFailed)
donorRouter.get('/public-ngos', listApprovedNgosForDonation)
donorRouter.get('/ngos', listApprovedNgosForDonation)
donorRouter.get('/my-profile',authDonor,getProfile)
donorRouter.post('/update-profile',upload.single('image'),authDonor,updateProfile)
donorRouter.get('/getfood',authDonor,getAllDonatedFoods)
donorRouter.get('/my-donations',authDonor,myDonation)


export default donorRouter;
