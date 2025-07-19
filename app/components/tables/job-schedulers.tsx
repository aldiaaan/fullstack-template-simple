import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/libs/trpc/app-router";
import { Checkbox } from "../ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFacet } from "../data-table/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Check, MoreHorizontal } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import type React from "react";
import { useState } from "react";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useMutation } from "@tanstack/react-query";
export type BackgroundJobSchedulerRowItem =
  inferRouterOutputs<AppRouter>["backgroundJobs"]["schedulers"]["list"]["schedulers"][number];

export type BackgroundJobSchedulerMenuProps = {
  children?: React.ReactNode;
  id: string;
  queue: string;
};

export function BackgroundJobSchedulerMenu(
  props: BackgroundJobSchedulerMenuProps
) {
  const { id, children, queue } = props;

  const [isOpen, setIsOpen] = useState(false);

  const trpc = useTRPC();

  const { mutateAsync: stop, isPending: isStopping } = useMutation(
    trpc.backgroundJobs.schedulers.stop.mutationOptions({})
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            stop({
              key: id,
              queue,
            });
          }}
        >
          Stop
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
      <p className="font-semibold">{row.original.name} Scheduler</p>
    ),
    header: () => "Name",
  },
  {
    id: "Frequency",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <p className="font-semibold text-muted-foreground">
            {row.original.patternHumanReadable}
          </p>
        </TooltipTrigger>
        <TooltipContent>{row.original.pattern}</TooltipContent>
      </Tooltip>
    ),
    header: () => "Frequency",
  },
  {
    id: "Status",
    header: () => "",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 transition-all">
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm px-2.5 py-1 flex items-center justify-center rounded-md bg-green-50 text-gray-600 border border-green-300">
                <Check className="w-4 h-4 text-green-600 mr-1" />
                {row.original.iterationCount}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              Successful runs: {row.original.iterationCount}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        row.original.key && (
          <BackgroundJobSchedulerMenu
            queue={row.original.queue}
            id={row.original.key}
          >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </BackgroundJobSchedulerMenu>
        )
      );
    },
  },
] as ColumnDef<BackgroundJobSchedulerRowItem>[];

export const facets = [{}] as DataTableFacet<BackgroundJobSchedulerRowItem>[];
