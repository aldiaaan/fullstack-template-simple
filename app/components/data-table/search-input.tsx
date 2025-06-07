import type { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { cn } from "~/utils/react";
import { useCallback, useEffect, useState } from "react";

export type DataTableSearchInputProps<TData> = {
  table: Table<TData>;
  className?: string;
  searchables?: (keyof TData)[];
};

export function DataTableSearchInput<TData>(
  props: DataTableSearchInputProps<TData>
) {
  const { table, className, searchables } = props;

  const [query, setQuery] = useState<string>();
  const [debouncedQuery, setDebouncedQuery] = useState(query); // Debounced value

  const handleChange = useCallback((value?: string) => {
    setQuery(value);
  }, []);

  useEffect(() => {
    // Set a timeout to update debounced value after 500ms
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    // Cleanup the timeout if `query` changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    searchables?.forEach((column) => {
      table.getColumn(column as string)?.setFilterValue(debouncedQuery);
    });
  }, [debouncedQuery]);

  return (
    <Input
      placeholder="Search"
      value={query}
      onChange={(e) => handleChange(e.currentTarget.value)}
      className={cn("h-8 w-[150px] lg:w-[250px]", className)}
    />
  );
}
