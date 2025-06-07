import { DashboardSectionHeader } from "~/components/dashboard/section-header";
import { DataTable } from "~/components/ui/data-table";
import { SidebarInset } from "~/components/ui/sidebar";
import { Checkbox } from "~/components/ui/checkbox";
import { formatDistance } from "date-fns";

import _ from "lodash";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useState } from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  formatTanstackTableFilters,
  formatTanstackTableSorting,
} from "~/utils/react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function DashboardUsersPage() {
  const trpc = useTRPC();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<ColumnFiltersState>([]);

  const [sorting, setSorting] = useState<SortingState>([]);

  console.log({ filters, pagination, sorting });

  const query = useDeferredValue({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    ...formatTanstackTableFilters(filters),
    orders: formatTanstackTableSorting(sorting),
  });

  const { data, isPending, error, refetch } = useQuery(
    trpc.user.hq.get.queryOptions(query)
  );

  const { total = 1, users } = data || {};

  return (
    <SidebarInset>
      <DashboardSectionHeader title="Users" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center gap-2"></div>
              </div>
              <DataTable
                error={error?.message}
                filters={filters}
                onFiltersChange={setFilters}
                sorting={sorting}
                onSortingChange={setSorting}
                onPaginationChange={setPagination}
                pagination={pagination}
                total={total}
                isLoading={isPending}
                onRetry={refetch}
                facets={[
                  {
                    column: "permissions",
                    title: "Permissions",
                    options: [
                      {
                        label: "read:all",
                        value: "read:all",
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
                ]}
                columns={[
                  {
                    id: "select",
                    header: ({ table }) => (
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                              "indeterminate")
                          }
                          onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                          }
                          aria-label="Select all"
                        />
                      </div>
                    ),
                    cell: ({ row }) => (
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                            row.toggleSelected(!!value)
                          }
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
                          onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                          }
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
                ]}
                data={users || []}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
