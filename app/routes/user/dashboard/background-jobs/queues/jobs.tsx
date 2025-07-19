import { skipToken, useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import { useParams } from "react-router";
import { DataTable } from "~/components/data-table/data-table";
import { columns } from "~/components/tables/background-jobs";
import { useDataTable } from "~/hooks/use-data-table";
import { useTRPC } from "~/libs/trpc/clients/react";
import {
  formatTanstackTableFilters,
  formatTanstackTableSorting,
} from "~/utils/react";

export default function BackgroundJobsJobsPage() {
  const trpc = useTRPC();

  const { name: queueName } = useParams<{ name: string }>();

  const table = useDataTable();

  const query = useDeferredValue({
    page: table.pagination.pageIndex,
    limit: table.pagination.pageSize,
    filters: formatTanstackTableFilters(table.filters),
    orders: formatTanstackTableSorting(table.sorting),
  });

  const { data: data, isLoading } = useQuery({
    ...trpc.backgroundJobs.jobs.list.queryOptions(
      queueName
        ? {
            ...query,
            queue: queueName,
          }
        : skipToken
    ),
    refetchInterval: 1200,
  });

  return (
    <DataTable
      className="**:data-[slot=table-cell]:first:w-10 **:data-[slot=table-cell]:nth-3:w-36 **:data-[slot=table-cell]:nth-4:w-36 **:data-[slot=table-cell]:nth-5:w-36 **:data-[slot=table-cell]:nth-6:w-20 **:data-[slot=table-cell]:last:w-10"
      isLoading={isLoading}
      {...table}
      data={data?.jobs || []}
      total={data?.total || 0}
      columns={columns}
    />
  );
}
