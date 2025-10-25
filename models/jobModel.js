import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['email', 'report', 'calculation', 'notification'], 
    default: 'email' 
  },
  schedule: { 
    type: String, 
    required: true,  
  },
  lastRunAt: { 
    type: Date
    
  },
  nextRunAt: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'running', 'completed', 'failed'], 
    default: 'scheduled' 
  },
  meta: { 
    type: Object 
  },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema, 'Jobs');
