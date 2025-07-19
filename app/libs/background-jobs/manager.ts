import { Queue } from "bullmq";
import { redis, redis2 } from "../redis";
import { formatDistance } from "date-fns";
import cronstrue from "cronstrue";
import { JobStatuses, configV2 } from "./constants";
import { formatDurationWithMs } from "~/utils/date";
import { BackgroundJobPresenter } from "~/presenters/background-jobs/background-job";

export class BackgroundJobsManager {
  queues = configV2.queues.map(
    (queue) =>
      new Queue(queue.name, {
        connection: redis,
      })
  );

  getQueue(name?: string) {
    return this.queues.find((q) => q.name === name);
  }

  getDefaultQueue() {
    return this.queues[0];
  }

  async retryJob(args: { queue: string; jobId: string }) {
    const targetQueue = this.getQueue(args.queue);

    if (!targetQueue)
      throw new Error(`Queue with name ${args.queue} not found`);

    const job = await targetQueue.getJob(args.jobId);

    if (!job) throw new Error(`Cannot find job with id ${args.jobId}`);

    await job.updateData({ ...job.data, _isAborted: false });

    await job.retry();
  }

  async addJob(
    args: {
      queue: string;
      job: { name: string; payload: any };
      // using UTC as default
      schedule?: Date;
      // cron expression like * * * * 5
      repeat?: string;
    },
    strict: boolean = false
  ) {
    const q = this.getQueue(args.queue);

    if (!q) throw new Error(`Cannot find queue with name ${args?.queue}.`);

    // do strict check
    if (strict) {
      const q = configV2.queues.find((q) => q.name === args.queue);

      if (!q)
        throw new Error(
          `Cannot find queue with name ${args?.queue} in config.`
        );

      const j = q.jobs.find((j) => j.name === args.job.name);

      if (!j)
        throw new Error(
          `Job '${args.job.name}' is not registered for queue '${args.queue}'. You either placed this job in the wrong queue or forgot to define it in the configuration.`
        );
    }

    if (args.schedule) {
      const dateNow = new Date();
      const scheduledDate = new Date(args.schedule);

      // just to make sure no negative delay
      const delay = Math.max(scheduledDate.getTime() - dateNow.getTime(), 0);

      return q.add(args.job.name, args.job.payload, {
        delay,
      });
    } else {
      if (args.repeat) {
        return q.upsertJobScheduler(
          `${args.job.name}`,
          {
            pattern: args.repeat,
          },
          {
            name: args.job.name,
            data: args.job.payload,
          }
        );
      } else {
        return q.add(args.job.name, args.job.payload);
      }
    }
  }

  async stopScheduler(args: { queue: string; schedulerKey: string }) {
    const targetQueue = this.getQueue(args.queue);

    if (!targetQueue)
      throw new Error(`Queue with name ${args.queue} not found`);

    return targetQueue.removeJobScheduler(args.schedulerKey);
  }

  async deleteJob(args: { queue: string; jobId: string }) {
    const targetQueue = this.getQueue(args.queue);

    if (!targetQueue)
      throw new Error(`Queue with name ${args.queue} not found`);

    const job = await targetQueue.getJob(args.jobId);

    if (!job) throw new Error(`Cannot find job with id ${args.jobId}`);
    // await job.updateData({
    //   name: "BOOO",
    //   _signal: "stop",
    // });
    try {
      await job.remove();
    } catch (err) {
      if (job.id) {
        await redis2.publish(job.id, job.id);
      }
    }
  }

  async getJobSchedulers(args: {
    queue: string;
    page?: number;
    limit?: number;
  }) {
    const { limit = 10, page = 0, queue } = args || {};

    const targetQueue = this.getQueue(queue) || this.getDefaultQueue();

    return {
      schedulers: (
        await targetQueue.getJobSchedulers(page * limit, (page + 1) * limit - 1)
      ).map((scheduler) => ({
        queue,
        id: scheduler.id,
        name: scheduler.name,
        key: scheduler.key,
        pattern: scheduler.pattern,
        data: scheduler.template?.data,
        iterationCount: scheduler.iterationCount || 0,
        patternHumanReadable: scheduler.pattern
          ? cronstrue.toString(scheduler.pattern)
          : "-",
      })),
      total: await targetQueue.getJobSchedulersCount(),
    };
  }

  async getJobs(args: {
    queue: string;
    page?: number;
    limit?: number;
    statuses?: JobStatuses[];
  }): Promise<{
    total: number;
    jobs: {
      id: string;
      name: string;
      finishedOn: string;
      status: JobStatuses;
      processedOn: string;
      createdOn: string;
      attemptsMade: number;
      finishedOnTimestamp?: number;
      processedOnTimestamp?: number;
      createdOnTimestamp: number;
      queue: string;
    }[];
  }> {
    const {
      limit = 10,
      page = 0,
      queue,
      statuses = Object.values(JobStatuses),
    } = args || {};

    const targetQueue = this.getQueue(queue);

    if (!targetQueue) throw new Error(`Queue with name ${queue} not found`);

    const jobs = await targetQueue.getJobs(
      undefined,
      page * limit,
      (page + 1) * limit - 1
    );

    return {
      jobs: await Promise.all(
        jobs.map(async (job) => {
          return {
            ...(await BackgroundJobPresenter.fromJSON(job)),
            queue,
          };
        })
      ),
      total: await this.getDefaultQueue().getJobCountByTypes(),
    };
  }

  addJobTest() {
    this.queues[0].add("Example Job", {
      x: 1,
    });
  }

  async getJob(args: { queue: string; id: string }) {
    const { id, queue } = args;

    const targetQueue = this.getQueue(queue);

    if (!targetQueue) throw new Error(`Queue with name ${queue} not found`);

    if (!targetQueue) throw new Error(`Queue with name ${queue} not found`);

    const job = await targetQueue.getJob(id);

    if (!job) throw new Error(`Cannot find job with id ${id}`);

    return {
      ...(await BackgroundJobPresenter.fromJSON(job)),
      queue,
    };
  }

  async getJobLogs(args: { queue: string; id: string }) {
    const { id, queue } = args;

    const targetQueue = this.getQueue(queue);

    if (!targetQueue) throw new Error(`Queue with name ${queue} not found`);

    return targetQueue.getJobLogs(id);
  }
}

export const backgroundJobsManager = new BackgroundJobsManager();
