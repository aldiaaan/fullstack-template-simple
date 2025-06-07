import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import qs from "qs";
import {
  formatTanstackTableFilters,
  formatTanstackTableSorting,
  inferStringType,
} from "~/utils/react";

function decode(obj: Record<string, string[] | undefined>) {
  const cloned = {} as Record<string, any>;

  Object.keys(obj).forEach((key) => {
    let value = obj[key];

    if (Array.isArray(value)) {
      cloned[key] = value.map((member) => {
        return inferStringType(member);
      });
    } else if (typeof value === "string") {
      cloned[key] = inferStringType(value);
    } else if (key === "sorting") {
      cloned["sorting"] = value;
    }
  });

  return cloned as {
    page: number;
    limit: number;
    sorting: {
      [key: string]: "asc" | "desc" | undefined;
    };
    [key: string]:
      | number
      | { [key: string]: "asc" | "desc" | undefined }
      | string[]; // This is the new part
  };
}

export function useDataTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page,
    limit,
    sorting: initialSorting = {},
    ...rest
  } = useMemo(
    () =>
      decode(
        qs.parse(searchParams.toString()) as Record<
          string,
          string[] | undefined
        >
      ),
    [searchParams]
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1 || 0,
    pageSize: limit || 10,
  });

  const [filters, setFilters] = useState<ColumnFiltersState>(
    Object.keys(rest).map((key) => ({
      id: key,
      value: rest[key],
    }))
  );

  const [sorting, setSorting] = useState<SortingState>(
    Object.keys(initialSorting).map((key) => {
      return {
        id: key,
        desc: initialSorting[key] === "asc" ? false : true,
      };
    })
  );

  useEffect(() => {
    const newSearchParams = qs.stringify(
      {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...formatTanstackTableFilters(filters),
        sorting: formatTanstackTableSorting(sorting),
      },
      {
        encode: false,
      }
    );

    setSearchParams(newSearchParams, { replace: true });
  }, [filters, pagination, sorting]);

  return {
    pagination,
    onPaginationChange: setPagination,
    filters,
    onFiltersChange: setFilters,
    sorting,
    onSortingChange: setSorting,
  };
}
