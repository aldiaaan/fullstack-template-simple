import { IconDotsVertical } from "@tabler/icons-react";
import { skipToken, useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  Download,
  Menu,
  MoreHorizontal,
  ZoomIn,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { BackgroundJobMenu } from "~/components/background-job-menu";
import { DashboardSectionHeader } from "~/components/dashboard/section-header";
import { DashboardSectionMain } from "~/components/dashboard/section-main";
import { EmptyState } from "~/components/empty-state";
import { JobStatus } from "~/components/job-status";
import { RichText } from "~/components/rich-text";
import { Button } from "~/components/ui/button";
import { SidebarInset } from "~/components/ui/sidebar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";
import { JobStatuses } from "~/libs/background-jobs/constants";
import { useTRPC } from "~/libs/trpc/clients/react";

export type JobLogsProps = {
  jobId?: string;
  queue?: string;
  errors?: string[];
};

export function JobLogs(props: JobLogsProps) {
  const { jobId, queue, errors = [] } = props;

  const trpc = useTRPC();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const exportAsTxt = useCallback((data: string[]) => {
    const fileContent = data.join("\n");
    const blob = new Blob([fileContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${jobId}-logs-${new Date()}.txt`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const { data } = useQuery(
    trpc.backgroundJobs.jobs.logs.queryOptions(
      queue && jobId
        ? {
            jobId,
            queue: queue,
          }
        : skipToken,
      {
        refetchInterval: 500,
      }
    )
  );

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: -scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [data?.logs, errors]);

  return (
    <div className="relative pt-9 rounded-md overflow-hidden border border-gray-200">
      <div
        ref={scrollContainerRef}
        className="bg-muted relative px-4 py-4 flex flex-col-reverse gap-1 flex-1 h-[420px] overflow-auto"
      >
        {data?.logs.length === 0 && (
          <div className="absolute text-muted-foreground tracking-tight inset-0 flex items-center justify-center">
            <EmptyState
              className="border-none"
              title="Crickets... (No Logs Here!)"
            />
          </div>
        )}

        {data?.logs.map((log, index) => (
          <RichText
            as="code"
            text={log}
            className="block text-sm"
            key={index}
          />
        ))}
        {errors.map((error, index) => (
          <RichText
            as="code"
            text={error}
            className="block text-sm px-3 py-2 mb-2 border-red-300 border rounded bg-red-100"
            key={index}
          />
        ))}
      </div>
      <div className="absolute bg-muted/90 flex justify-end border-b shadow border-gray-200 top-0 left-0 right-0">
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="icon"
              className="cursor-pointer"
              variant="secondary"
              onClick={() => {
                exportAsTxt(data?.logs || []);
              }}
            >
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export as .txt file</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default function JobDetailsPage() {
  const { jobId, name: queueName } = useParams<{
    jobId: string;
    name: string;
  }>();

  const trpc = useTRPC();

  const { data, isPending, refetch } = useQuery(
    trpc.backgroundJobs.jobs.details.queryOptions(
      queueName && jobId
        ? {
            jobId,
            queue: queueName,
          }
        : skipToken,
      {
        refetchInterval: 3000,
      }
    )
  );

  const navigate = useNavigate();

  const renderActions = useCallback(() => {
    if (!jobId || !queueName) return;

    return (
      <BackgroundJobMenu
        onReset={() => {
          refetch();
        }}
        onDeleted={() => {
          navigate(`/dashboard/background-jobs/queues/${queueName}`);
        }}
        id={jobId}
        queue={queueName}
      >
        <Button size={"icon"} variant="ghost">
          <MoreHorizontal />
        </Button>
      </BackgroundJobMenu>
    );
  }, [jobId, queueName]);

  return (
    <SidebarInset>
      <DashboardSectionHeader
        renderActions={renderActions}
        title={
          <div className="flex gap-2 items-center">
            <JobStatus status={data?.status} />
            <p>
              {`${data?.name}`}{" "}
              <span className="text-muted-foreground">#{jobId}</span>
            </p>
          </div>
        }
      />
      <div className="border-b flex gap-10 py-4 px-8">
        <div className="flex-1 ">
          <div className="flex w-full  min-w-0 text-sm">
            <p className="mr-2 font-semibold tracking-tight">Attempts</p>
            <code className="ml-auto">{data?.attemptsMade}</code>
          </div>
          <div className="flex w-full  min-w-0 text-sm">
            <p className="mr-2 font-semibold tracking-tight">Created</p>
            <code className="ml-auto">{data?.createdOn}</code>
          </div>
          <div className="flex w-full  min-w-0 text-sm">
            <p className="mr-2 font-semibold tracking-tight">Processed</p>
            <code className="ml-auto">{data?.processedOn}</code>
          </div>
          <div className="flex w-full  min-w-0 text-sm">
            <p className="mr-2 font-semibold tracking-tight">Finished</p>
            <code className="ml-auto">{data?.finishedOn}</code>
          </div>
          <div className="flex w-full  min-w-0 text-sm">
            <p className="mr-2 font-semibold tracking-tight">Duration</p>
            <code className="ml-auto">{data?.duration}</code>
          </div>
        </div>
        <div className="flex-1 ">
          <div className="flex w-full  min-w-0 text-sm">
            <p className="mr-2 font-semibold tracking-tight">Queue</p>
            <Link
              className="ml-auto"
              viewTransition
              to={`/dashboard/background-jobs/queues/${data?.queue}`}
            >
              <code className=" underline">{data?.queue}</code>
            </Link>
          </div>
        </div>
        <div className="flex-1 "></div>
        <div className="flex-1 "></div>
      </div>
      <DashboardSectionMain>
        <div>{JSON.stringify(data?.result)}</div>
        <JobLogs
          jobId={jobId}
          errors={data?.status === JobStatuses.FAILED ? data?.stacktrace : []}
          queue={queueName}
        />
      </DashboardSectionMain>
    </SidebarInset>
  );
}
