
import Job from '../models/jobModel.js';

class JobRepository {
  async create(jobData) {
    return Job.create(jobData);
  }

  async findById(id) {
    return Job.findById(id);
  }

  async findAll() {
    return Job.find({}).sort({ createdAt: -1 });
  }

 
}

export default new JobRepository(); // Export a singleton instance
