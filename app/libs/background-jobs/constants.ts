export const JobStatuses = {
  LATEST: "latest",
  ACTIVE: "active",
  WAITING: "waiting",
  WAITING_CHILDREN: "waiting-children",
  PRIORITIZED: "prioritized",
  COMPLETED: "completed",
  FAILED: "failed",
  DELAYED: "delayed",
  PAUSED: "paused",
  ABORTED: "aborted",
} as const;

export type JobStatuses = (typeof JobStatuses)[keyof typeof JobStatuses];

export const QueueKeys = Object.freeze({
  EXAMPLE: "Example Queue",
});

export const JobNames = Object.freeze({
  COUNTER: "Counter Job",
});

export const configV2 = {
  queues: [
    {
      name: QueueKeys.EXAMPLE,
      jobs: [
        {
          name: JobNames.COUNTER,
          configurable: [
            {
              field: "name",
              name: "Name",
              type: "string" as const,
            },
          ],
        },
      ],
    },
  ],
};

export type BackgroundJobConfig = typeof configV2;

export const queueNames = Object.values(configV2.queues).map(
  (item) => item.name
);
