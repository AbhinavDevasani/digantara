import cron from "node-cron";
import Job from "../models/jobModel.js";
import cronstrue from "cronstrue";
import cronParserModule from "cron-parser"; // For nextRunAt calculation

// ✅ Handles both v4 and v5 of cron-parser
const cronParser = cronParserModule.parseExpression
  ? cronParserModule
  : cronParserModule.default;

export const scheduleJob = (job) => {
  const cronExpr = job.schedule;

  // Convert CRON to readable text
  const humanReadable = cronstrue.toString(cronExpr, {
    use24HourTimeFormat: true,
    verbose: true,
  });

  // 🧮 Calculate initial next run based on cron schedule
  try {
    const interval = cronParser.parseExpression(cronExpr);
    job.nextRunAt = interval.next().toDate();
    console.log(`Initial Next run for ${job.name}: ${job.nextRunAt}`);
  } catch (err) {
    console.error("Error calculating initial next run:", err);
    job.nextRunAt = null;
  }

  // Schedule the actual job
  cron.schedule(cronExpr, async () => {
    console.log(`Running job: ${job.name}`);
    job.lastRunAt = new Date();

    try {
      const interval = cronParser.parseExpression(cronExpr);
      job.nextRunAt = interval.next().toDate(); // ⏭ next scheduled run
      console.log(`Next run for ${job.name}: ${job.nextRunAt}`);
    } catch (err) {
      console.error("Error calculating next run:", err);
      job.nextRunAt = null;
    }

    await job.save();
    console.log(`Job ${job.name} updated`);
  });

  console.log(`Job scheduled: ${job.name} (${humanReadable})`);
};
