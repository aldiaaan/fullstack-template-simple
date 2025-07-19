import { backgroundJobsManager } from "~/libs/background-jobs/manager";
import { procedure, router } from "../trpc";
import z from "zod";
import { JobStatuses } from "~/libs/background-jobs/constants";

export const backgroundJobsRouter = router({
  schedulers: {
    stop: procedure
      .input(
        z.object({
          key: z.string(),
          queue: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await backgroundJobsManager.stopScheduler({
          queue: input.queue,
          schedulerKey: input.key,
        });
      }),
    list: procedure
      .input(
        z.object({
          page: z.number().default(0),
          limit: z.number().default(10),
          queue: z.string(),
        })
      )
      .query(async ({ input }) => {
        return await backgroundJobsManager.getJobSchedulers(input);
      }),
  },
  jobs: {
    retry: procedure
      .input(
        z.object({
          jobId: z.string(),
          queue: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await backgroundJobsManager.retryJob({
          jobId: input.jobId,
          queue: input.queue,
        });
      }),
    logs: procedure
      .input(
        z.object({
          jobId: z.string(),
          queue: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        return await backgroundJobsManager.getJobLogs({
          id: input.jobId,
          queue: input.queue,
        });
      }),
    details: procedure
      .input(
        z.object({
          jobId: z.string(),
          queue: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        return await backgroundJobsManager.getJob({
          id: input.jobId,
          queue: input.queue,
        });
      }),
    delete: procedure
      .input(
        z.object({
          id: z.string(),
          queue: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await backgroundJobsManager.deleteJob({
          jobId: input.id,
          queue: input.queue,
        });
      }),
    list: procedure
      .input(
        z.object({
          page: z.number().default(0),
          limit: z.number().default(10),
          queue: z.string(),
          statuses: z
            .array(
              z.enum([
                JobStatuses.ACTIVE,
                JobStatuses.COMPLETED,
                JobStatuses.DELAYED,
                JobStatuses.FAILED,
                JobStatuses.LATEST,
                JobStatuses.PAUSED,
                JobStatuses.PRIORITIZED,
                JobStatuses.WAITING,
                JobStatuses.WAITING_CHILDREN,
              ])
            )
            .optional(),
        })
      )
      .query(async ({ input }) => {
        return await backgroundJobsManager.getJobs(input);
      }),
    add: procedure
      .input(
        z.object({
          name: z.string(),
          payload: z.any().default({}),
          queue: z.string(),
          run: z.enum(["immediately", "scheduled"]).default("immediately"),
          schedule: z.coerce.date().optional(),
          repeat: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await backgroundJobsManager.addJob({
          queue: input.queue,
          job: {
            name: input.name,
            payload: input.payload,
          },
          repeat: input.repeat,
          schedule: input.schedule,
        });
      }),
  },
  queue: {},
});
