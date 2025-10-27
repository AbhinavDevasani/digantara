
# Digantara

Digantara is a lightweight cron-based job scheduling service built with Node.js and MongoDB. Jobs (cron expressions) are persisted in MongoDB; the scheduler computes nextRunAt/lastRunAt and executes task handlers.

## Features
- Persisted cron job scheduling (nextRunAt / lastRunAt)
- Human-readable cron descriptions (cronstrue)
- Cron parsing to compute next run times (cron-parser)
- Scheduler controller to register cron tasks (node-cron)
- Simple HTTP API for creating/managing jobs
- Mongoose models for persistence

## Repository layout
- controllers/ — scheduler logic (controllers/scheduler.js)
- models/ — Mongoose models (Job model, etc.)
- routes/ — API routes (create/read/update/delete jobs)
- scheduler/ — worker or scheduling utilities (if present)
- .env — environment variables (not committed)

## Prerequisites
- Node.js 18+
- npm
- MongoDB (local or Atlas)

## Environment variables
Create a `.env` file in the project root with:
- PORT=8000


## Quickstart — local
1. Install dependencies:

npm install

2. Create `.env` with required variables.

3. Start the API (this should also register persisted jobs with the scheduler on startup if implemented):

npm run start


4. Example: create a job via HTTP (adjust route accordingly, e.g., POST /jobs)
Request body example:

{
  "name": "daily-backup",
  "schedule": "0 2 * * *",
  "data": { "path": "/var/backups" }
}


The scheduler will compute and save nextRunAt and update lastRunAt when the job runs.

## How the scheduler works
- controllers/scheduler.js exposes scheduleJob(job)
- scheduleJob computes an initial nextRunAt using cron-parser, logs a human-readable description using cronstrue, and registers a node-cron job
- On each run, lastRunAt is set, nextRunAt is recomputed, and job is saved back to MongoDB

## Testing & development tips
- Use short cron expressions for fast integration testing (e.g., "* * * * *")
- On server startup, load persisted jobs and call scheduleJob for each active job
- Unit-test scheduleJob by mocking a job document with a fake save() method

## Troubleshooting
- Mongo connection errors: verify MONGO_URI and network access, check Atlas IP whitelist if using Atlas
- Cron parsing errors: validate cron expressions before saving; cron-parser will throw on invalid expressions




