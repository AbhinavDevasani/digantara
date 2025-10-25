import cron from "node-cron";
import Job from "../models/jobModel.js";
import cronstrue from "cronstrue";
export const scheduleJob = (job) => {
  const cronExpr =  '*/10 * * * * *';
   const humanReadable = cronstrue.toString(cronExpr, {
      use24HourTimeFormat: true,
      verbose: true
    });
  cron.schedule(cronExpr, async () => {
    console.log(`Running job: ${job.name}`);

    console.log(job.lastRunAt = new Date());
    console.log(job.nextRunAt = new Date(Date.now() + 3600 * 1000));
    await job.save();
    console.log(`Job ${job.name} updated`);

  });

  console.log(`Job scheduled: ${job.name} (${humanReadable})`);
};

