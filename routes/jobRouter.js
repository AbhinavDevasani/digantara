import express from 'express'
import { createJob,getAllJob,getJobById } from '../controllers/jobController.js'
const router=express.Router()
router.post("/jobs",createJob)
router.get("/jobs",getAllJob)
router.get("/jobs/:id",getJobById)
export default router