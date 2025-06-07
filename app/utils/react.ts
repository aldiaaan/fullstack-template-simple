import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTanstackTableFilters<TFilter = { [key: string]: string }>(
  filters: ColumnFiltersState
) {
  return filters.reduce((acc, item) => {
    // @ts-ignore
    acc[item.id] = item.value;
    return acc;
  }, {} as TFilter);
}

export function formatTanstackTableSorting<
  TSorting = { [key: string]: "desc" | "asc" | undefined }
>(sorting: SortingState) {
  return sorting.reduce((acc, item) => {
    // @ts-ignore
    acc[item.id] = item.desc ? "desc" : item.desc === false ? "asc" : undefined;
    return acc;
  }, {} as TSorting);
}

export function inferStringType(str: string) {
  if (!isNaN(Number(str)) && str !== "") {
    return Number(str);
  }

  if (str.toLowerCase() === "true") {
    return true;
  }
  if (str.toLowerCase() === "false") {
    return false;
  }

  if (str.toLowerCase() === "null") {
    return null;
  }

  if (str.toLowerCase() === "undefined") {
    return undefined;
  }

  return str;
}
