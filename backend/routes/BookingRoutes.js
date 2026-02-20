import express from "express"
import {createBooking,getbookingbyEmail,updateBookingStatus} from "../controllers/BookingController.js"

const router = express.Router()


router.post("/",createBooking);
router.get("/",getbookingbyEmail);
router.patch("/:id/status",updateBookingStatus)

export default router; 