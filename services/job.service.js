import cron from "node-cron";
import Job from "../models/jobModel.js";
import cronstrue from "cronstrue";
import parser from "cron-parser"; 

export const scheduleJob = (job) => {
  const cronExpr = job.schedule;

  
  const humanReadable = cronstrue.toString(cronExpr, {
    use24HourTimeFormat: true,
    verbose: true,
  });


  try {
    const interval = parser.parseExpression(cronExpr);
    job.nextRunAt = interval.next().toDate();
  } catch (err) {
    console.error("Error calculating initial next run:", err);
  }


  cron.schedule(cronExpr, async () => {
    console.log(`Running job: ${job.name}`);

   
    job.lastRunAt = new Date();

    try {
      const interval = parser.parseExpression(cronExpr);
      job.nextRunAt = interval.next().toDate(); 
    } catch (err) {
      console.error("Error calculating next run:", err);
    }

    await job.save();
    console.log(`Job ${job.name} updated`);
  });

  console.log(`Job scheduled: ${job.name} (${humanReadable})`);
};
