import type { Job } from "bullmq";
import { formatDistance } from "date-fns";
import type { JobStatuses } from "~/libs/background-jobs/constants";
import { formatDurationWithMs } from "~/utils/date";

export class BackgroundJobPresenter {
  static async fromJSON(job: Job) {
    return {
      result: job.returnvalue,
      id: `${job.id}`,
      name: job.name,
      attemptsMade: job.attemptsMade || 0,
      status: job.data?._isAborted ? "aborted" : await job.getState(),
      createdOnTimestamp: job.timestamp,
      processedOnTimestamp: job.processedOn,
      finishedOnTimestamp: job.finishedOn,
      stacktrace: job.stacktrace
        ? [job.stacktrace[job.stacktrace.length - 1]]
        : undefined,
      isError: Boolean(job.stacktrace),
      duration:
        job.processedOn && job.finishedOn
          ? formatDurationWithMs(job.processedOn, job.finishedOn)
          : "-",
      createdOn: job.timestamp
        ? formatDistance(new Date(job.timestamp), new Date(), {
            addSuffix: true,
          })
        : "-",
      processedOn: job.processedOn
        ? formatDistance(new Date(job.processedOn), new Date(), {
            addSuffix: true,
          })
        : "-",
      finishedOn: job.finishedOn
        ? formatDistance(new Date(job.finishedOn), new Date(), {
            addSuffix: true,
          })
        : "-",
    } as {
      result?: any;
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
      duration: string;
      stacktrace?: string[];
      isError: boolean;
    };
  }
}
