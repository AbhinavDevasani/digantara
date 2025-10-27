import { Worker } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

const worker = new Worker(
  'jobs',
  async (job) => {
    console.log(`Processing job: ${job.name}`);
    console.log('Payload:', job.data);

    // Example task based on job type
    switch (job.name) {
      case 'email':
        console.log('Sending email with data:', job.data);
        break;
      case 'report':
        console.log('Generating report with data:', job.data);
        break;
      case 'calculation':
        console.log('Performing calculation with data:', job.data);
        break;
      case 'notification':
        console.log('Sending notification with data:', job.data);
        break;
      default:
        console.log('Unknown job type:', job.name);
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

console.log('Worker started and listening to jobs queue');
