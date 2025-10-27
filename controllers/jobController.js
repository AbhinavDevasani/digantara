import Job from '../models/jobModel.js';
import { scheduleJob } from './scheduler.js';
export const createJob= async (req, res) => {
  try {
    const job = await Job.create(req.body);
    scheduleJob(job)
    res.status(200).json({"data": job });
  } catch (err) {
    res.status(400).json({"message": err});
  }
};
export const getAllJob = async (req, res) => {
  try {
    const jobs = await Job.find({})
    res.json({ "data": jobs });
  } catch (err) {
    res.status(500).json({  "message": err });
  }
};
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job){
      return res.status(404).json({ "message": "Job not found" });
    }
    res.json({ "data": job });
  } catch (err) {
    res.status(500).json({  "message": err });
  }
};