import { Job } from "bullmq";
import { JobNames } from "../constants";
import { sleep } from "~/utils/network";

export const name = JobNames.COUNTER;

export const process = async (job: Job, abortController: AbortController) => {
  job.log(`[${new Date().toISOString()}] Starting job: ${job.name}`);

  const jobDurationInMs = 5 * 60 * 1000; // 5 minutes
  const startTime = Date.now();
  const endTime = startTime + jobDurationInMs;

  let n = 1;

  while (Date.now() < endTime) {
    const currentDate = new Date().toISOString();
    job.log(`Job data:  ${job.data}, "state: ",${await job.getState()}`);
    job.log(
      `[${job.id}] ${currentDate} ${n} times!! also Hello ${job.data.name}!`
    );

    if (abortController.signal.aborted) {
      job.updateData({ ...job.data, _isAborted: true });
      throw new Error("Graceful shutdown requested");
    }

    n++;
    await sleep(1000);
  }

  const finalMessage = `[${new Date().toISOString()}] Finished job: ${
    job.name
  } after 1 minutes.`;

  job.log(`Result: https://bitcoin.org/bitcoin.pdf`);

  return {
    status: "Completed",
    message: finalMessage,
    files: ["https://bitcoin.org/bitcoin.pdf"],
  };
};
