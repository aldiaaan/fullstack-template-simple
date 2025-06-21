import type { ColumnDef, Table } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/libs/trpc/app-router";
import type { DataTableFacet } from "../data-table/data-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { formatDistance } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { DeleteUsersAlert } from "../delete-user-alert";
import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useLocation, useNavigate } from "react-router";

export type UserRowItem =
  inferRouterOutputs<AppRouter>["user"]["hq"]["get"]["users"][number];

export type UserListItemMenuProps = {
  userId: string;
  children?: React.ReactNode;
};

export function UserListItemMenu(props: UserListItemMenuProps) {
  const { userId, children } = props;

  const trpc = useTRPC();

  const { mutateAsync: impersonate, isPending: isImpersonating } = useMutation(
    trpc.user.hq.impersonate.mutationOptions()
  );

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() =>
            impersonate(userId).then(() => {
              navigate(location.pathname, { viewTransition: true });
              queryClient.invalidateQueries();
            })
          }
        >
          {isImpersonating ? "Impersonating..." : "Impersonate"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BulkActions(props: { table: Table<UserRowItem> }) {
  const { table } = props;

  return (
    <div className="space-x-1">
      <DeleteUsersAlert
        users={table.getSelectedRowModel().rows.map((row) => row.original)}
      >
        <Button
          variant="destructive"
          size="sm"
          className="text-xs px-2 py-1 h-auto"
        >
          Delete
        </Button>
      </DeleteUsersAlert>
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
  {
    id: "actions",
    size: 24,
    cell: ({ row }) => {
      return (
        <UserListItemMenu userId={row.original.id}>
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-muted size-8"
          >
            <MoreHorizontal />
          </Button>
        </UserListItemMenu>
      );
    },
  },
] as ColumnDef<UserRowItem>[];
