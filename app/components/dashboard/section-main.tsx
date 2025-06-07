import type { HTMLAttributes } from "react";
import { cn } from "~/utils/react";

export type DashboardSectionMainProps = {} & HTMLAttributes<HTMLDivElement>;

export function DashboardSectionMain(props: DashboardSectionMainProps) {
  const { children, className } = props;

  return (
    <div className={cn("flex flex-1 flex-col", className)}>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:gap-6 md:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
