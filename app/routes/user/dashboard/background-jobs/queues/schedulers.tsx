import { useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import { useParams } from "react-router";
import { DataTable } from "~/components/data-table/data-table";
import { columns } from "~/components/tables/job-schedulers";
import { useDataTable } from "~/hooks/use-data-table";
import { useTRPC } from "~/libs/trpc/clients/react";
import {
  formatTanstackTableFilters,
  formatTanstackTableSorting,
} from "~/utils/react";

export default function BackgroundJobsSchedulersPage() {
  const trpc = useTRPC();

  const table = useDataTable();

  const { name: queue } = useParams<{ name: string }>();

  const query = useDeferredValue({
    page: table.pagination.pageIndex,
    limit: table.pagination.pageSize,
    filters: formatTanstackTableFilters(table.filters),
    orders: formatTanstackTableSorting(table.sorting),
  });

  const { data: data, isLoading } = useQuery({
    ...trpc.backgroundJobs.schedulers.list.queryOptions({
      ...query,
      queue: queue!,
    }),
    refetchInterval: 1500,
  });

  return (
    <DataTable
      className="**:data-[slot=table-head]:first:w-10 **:data-[slot=table-head]:nth-3:w-36 **:data-[slot=table-head]:nth-4:w-12 **:data-[slot=table-head]:last:w-12"
      isLoading={isLoading}
      {...table}
      data={data?.schedulers || []}
      total={data?.total || 0}
      columns={columns}
    />
  );
}
