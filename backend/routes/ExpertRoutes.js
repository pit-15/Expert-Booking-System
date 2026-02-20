import express from "express"
import { getExperts,getExpertsbyID } from "../controllers/ExpertController.js"

const router = express.Router()


router.get("/",getExperts);
router.get("/:id",getExpertsbyID)

export default router 