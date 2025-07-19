import { Job, Worker } from "bullmq";
import { redis, redis2 } from "~/libs/redis";
import { QueueKeys } from "../constants";
import { getProcessors } from "../utils/get-processors";

export const worker = new Worker(
  QueueKeys.EXAMPLE,
  async (job: Job) => {
    const processors = await getProcessors();

    const processor = processors[job.name];

    const abortController = new AbortController();

    const handler = (message: string) => {
      if (message === job.id) {
        abortController.abort("Graceful shutdown");
      }
    };

    if (job.id) {
      redis2.on("pmessage", handler);
    }

    if (!processor)
      throw new Error(`Cannot Pfind processor for job ${job.name}`);
    try {
      return await processor(job, abortController);
    } catch (err) {
      throw err;
    } finally {
      redis2.off("pmessage", handler);
    }
  },
  { connection: redis, autorun: false, concurrency: 10 }
);
