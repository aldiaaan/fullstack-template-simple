"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { cn } from "~/utils/react";

export type DataTableViewOptionsProps<TData> = {
  table: Table<TData>;
  className?: string;
};

export function DataTableViewOptions<TData>(
  props: DataTableViewOptionsProps<TData>
) {
  const { table, className } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("hidden h-8 lg:flex", className)}
        >
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
