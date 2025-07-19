import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/libs/trpc/app-router";
import { Checkbox } from "../ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFacet } from "../data-table/data-table";
import { Button } from "../ui/button";
import { Clock, Loader2, MoreHorizontal, Repeat } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { TimeDisplay } from "../time-display";
import { Link } from "react-router";
import { JobStatus } from "../job-status";
import { BackgroundJobMenu } from "../background-job-menu";

export type BackgroundJobRowItem =
  inferRouterOutputs<AppRouter>["backgroundJobs"]["jobs"]["list"]["jobs"][number];

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    cell: ({ row }) => (
      <Link
        viewTransition
        to={`/dashboard/background-jobs/queues/${row.original.queue}/jobs/${row.original.id}`}
        className="font-semibold hover:underline"
      >
        {row.original.name}{" "}
        <span className="text-muted-foreground">#{row.original.id}</span>
      </Link>
    ),
    header: () => "Name",
  },

  {
    id: "Created On",
    header: () => "Created On",
    accessorKey: "createdOn",
    cell: ({ row }) => (
      <p className="text-muted-foreground">{row.original.createdOn}</p>
    ),
  },
  {
    id: "Processed On",
    header: () => "Processed On",
    accessorKey: "processedOn",
    cell: ({ row }) => (
      <p className="text-muted-foreground">{row.original.processedOn}</p>
    ),
  },
  {
    id: "Finished On",
    accessorKey: "finishedOn",
    header: () => "Finished At",
    cell: ({ row }) => (
      <p className="text-muted-foreground">{row.original.finishedOn}</p>
    ),
  },
  {
    id: "Status",
    header: () => "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 transition-all">
          <JobStatus status={row.original.status} />
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm px-2.5 py-1 flex items-center justify-center rounded-md bg-gray-50 text-gray-600 border border-gray-300">
                <Repeat className="w-4 h-4 text-gray-600 mr-1" />
                {row.original.attemptsMade}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              Attempst made: {row.original.attemptsMade}
            </TooltipContent>
          </Tooltip>

          {row.original.processedOnTimestamp && (
            <Tooltip>
              <TooltipTrigger>
                <code className="text-sm px-2.5 py-1 flex items-center justify-center rounded-md bg-gray-50 text-gray-600 border border-gray-300">
                  {row.original.finishedOnTimestamp ? (
                    <Clock className="w-4 h-4 text-gray-600 mr-1" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground   mr-1.5" />
                  )}

                  <TimeDisplay
                    epochTimestamp={row.original.processedOnTimestamp}
                    epochTimestampEnd={row.original.finishedOnTimestamp}
                  />
                </code>
              </TooltipTrigger>
              <TooltipContent>
                How long this job has been running
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <BackgroundJobMenu id={row.original.id} queue={row.original.queue}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </BackgroundJobMenu>
      );
    },
  },
] as ColumnDef<BackgroundJobRowItem>[];

export const facets = [{}] as DataTableFacet<BackgroundJobRowItem>[];
