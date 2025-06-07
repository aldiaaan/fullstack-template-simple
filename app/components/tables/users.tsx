import type { ColumnDef, Table } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/libs/trpc/app-router";
import type { DataTableFacet } from "../data-table/data-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { formatDistance } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export type UserRowItem =
  inferRouterOutputs<AppRouter>["user"]["hq"]["get"]["users"][number];

export function BulkActions(props: { table: Table<UserRowItem> }) {
  return (
    <div className="space-x-1">
      <Button
        variant="destructive"
        size="sm"
        className="text-xs px-2 py-1 h-auto"
      >
        Delete
      </Button>
    </div>
  );
}

export const facets = [
  {
    column: "permissions",
    title: "Permissions",
    options: [
      {
        label: "read:all",
        value: "read:all",
      },
      {
        label: "test",
        value: 1,
      },
      {
        label: "impersonate:all",
        value: "impersonate:all",
      },
      {
        label: "write:all",
        value: "write:all",
      },
    ],
  },
] as DataTableFacet<UserRowItem>[];

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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return `${row.original.firstName}${
        row.original.lastName && ` ${row.original.lastName}`
      }`;
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return <p>{row.original.username}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return (
        <p>
          {formatDistance(row.original.createdAt!, new Date(), {
            addSuffix: true,
          })}
        </p>
      );
    },
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex cursor-pointer items-center select-none"
        >
          Registered At
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.permissions?.map((value) => {
            return (
              <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {value}
              </code>
            );
          })}
        </div>
      );
    },
  },
] as ColumnDef<UserRowItem>[];
