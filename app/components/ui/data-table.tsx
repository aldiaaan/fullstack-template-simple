import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { AnimatePresence, motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { useEffect, useMemo, useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Skeleton } from "./skeleton";
import { Button } from "./button";
import { Input } from "./input";

interface DataTableProps<TData, TValue> {
  error?: string;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  data: TData[];
  onRetry?: () => void;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onFiltersChange?: OnChangeFn<ColumnFiltersState>;
  filters: ColumnFiltersState;
  pagination?: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  facets?: {
    column: keyof TData;
    title?: string;
    options?: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  total?: number;
}

const MotionTableRow = motion(TableRow);

export function DataTable<TData, TValue>({
  columns,
  data,
  facets = [],
  pagination = {
    pageIndex: 0,
    pageSize: 10,
  },
  filters,
  onPaginationChange,
  onFiltersChange,
  total,
  isLoading,
  error,
  onSortingChange,
  onRetry,
  sorting,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const tableData = useMemo(
    () => (isLoading ? Array(pagination?.pageSize).fill({}) : data),
    [isLoading, data]
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-6 w-full rounded-sm" />,
          }))
        : columns,
    [isLoading]
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters: filters,
      pagination,
    },
    rowCount: total,
    enableRowSelection: true,
    manualFiltering: true,
    manualSorting: true,
    onPaginationChange: onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: onSortingChange,
    onColumnFiltersChange: onFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <Input
          placeholder="Search"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] mr-4"
        />
        {facets.map((facet) => (
          <DataTableFacetedFilter
            column={table.getColumn(facet.column as string)}
            options={facet.options || []}
            key={facet.column.toString()}
            title={facet.title}
          />
        ))}
        <div className="ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableCell colSpan={columns.length} className="h-96 text-center">
                <div>
                  <p className="text-5xl font-medium mb-4 tracking-tight">
                    Oops!
                  </p>
                  <p className="text-gray-700 mb-8">
                    Something went wrong. We are not sure yet and will examine
                    this case.
                  </p>

                  <div className="mb-6">
                    <code className="bg-muted w-4 whitespace-pre-line relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {error}
                    </code>
                  </div>

                  <Button onClick={onRetry}>Retry</Button>
                </div>
              </TableCell>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <AnimatePresence key={`${row.id}${isLoading && ".skeleton"}`}>
                  <MotionTableRow
                    data-row-id={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      // easeIn function
                      delay:
                        (index / (pagination.pageSize - 1)) *
                        (index / (pagination.pageSize - 1)) *
                        0.1 *
                        (pagination.pageSize - 1),
                    }}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </MotionTableRow>
                </AnimatePresence>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
