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
    // Do your task here, e.g., sending email or report generation
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(` Job ${job.id} failed:`, err);
});
