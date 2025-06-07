import { DashboardSectionHeader } from "~/components/dashboard/section-header";
import { DataTable } from "~/components/data-table/data-table";
import { SidebarInset } from "~/components/ui/sidebar";

import { useTRPC } from "~/libs/trpc/clients/react";
import { useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import {
  formatTanstackTableFilters,
  formatTanstackTableSorting,
} from "~/utils/react";
import { columns, facets } from "~/components/tables/users";
import { useDataTable } from "~/hooks/use-data-table";
import { DashboardSectionMain } from "~/components/dashboard/section-main";

export default function DashboardUsersPage() {
  const trpc = useTRPC();

  const table = useDataTable();

  const query = useDeferredValue({
    page: table.pagination.pageIndex,
    limit: table.pagination.pageSize,
    filters: formatTanstackTableFilters(table.filters),
    orders: formatTanstackTableSorting(table.sorting),
  });

  const { data, isPending, error, refetch } = useQuery(
    trpc.user.hq.get.queryOptions(query)
  );

  const { total = 1, users } = data || {};

  return (
    <SidebarInset>
      <DashboardSectionHeader title="Users" />
      <DashboardSectionMain>
        <DataTable
          error={error?.message}
          {...table}
          total={total}
          facets={facets}
          columns={columns}
          isLoading={isPending}
          onRetry={refetch}
          data={users}
          searchables={["email", "firstName", "lastName", "username"]}
        />
      </DashboardSectionMain>
    </SidebarInset>
  );
}
