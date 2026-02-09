import express from 'express'
import {registerVolunteer,loginVolunteer, getNearbyDeliveryRequests, acceptDeliveryRequest, getAllDeliveryRequests, getMyDeliveryHistory, getMyProfile, updateMyProfile, deleteMyAccount, getMyAppreciationCertificateData, getVolunteerDashboardStats, updateTaskStatus, getMyPickedUpFoods} from '../controllers/volunteerController.js'
import authVolunteer from '../middlewares/authVolunteer.js'
import upload from '../middlewares/multer.js'


const volunteerRouter=express.Router()

volunteerRouter.post('/register',registerVolunteer)
volunteerRouter.post('/login',loginVolunteer)
volunteerRouter.get('/requests/nearby', authVolunteer, getNearbyDeliveryRequests)
volunteerRouter.get('/requests/all', authVolunteer, getAllDeliveryRequests)
volunteerRouter.get('/requests/history', authVolunteer, getMyDeliveryHistory)
volunteerRouter.get('/my-profile', authVolunteer, getMyProfile)
volunteerRouter.post('/update-profile', authVolunteer, upload.single('image'), updateMyProfile)
volunteerRouter.get("/appreciation-certificate", authVolunteer, getMyAppreciationCertificateData)
volunteerRouter.delete('/delete-account', authVolunteer, deleteMyAccount)
volunteerRouter.post('/requests/:donationId/accept', authVolunteer, acceptDeliveryRequest)
volunteerRouter.get( "/dashboard-stats",authVolunteer,getVolunteerDashboardStats)
volunteerRouter.get( "/my-picked-up-foods", authVolunteer, getMyPickedUpFoods);
volunteerRouter.put( "/update-task-status/:id",authVolunteer,updateTaskStatus)


export default volunteerRouter
