import express from "express"
import {  } from "../controllers/BookingController.js"

const router = express.Router()


router.get("/",getExperts);
router.get("/:id",getExpertsbyID)

export default router 