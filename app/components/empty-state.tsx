import { Bird } from "lucide-react";
import type React from "react";
import type { HTMLAttributes } from "react";
import { cn } from "~/utils/react";

export type EmptyStateProps = {
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType;
} & HTMLAttributes<HTMLDivElement>;

export function EmptyState(props: EmptyStateProps) {
  const { title, subtitle, className, ...rest } = props;

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center h-96 rounded-md border-2 border-dashed  justify-center",
        className
      )}
      {...rest}
    >
      <div className="w-64">
        <p className="mb-2 font-semibold text-lg text-foreground tracking-tight text-center">
          {title}
        </p>
        <p className="text-sm text-muted-foreground text-center">{subtitle}</p>
      </div>
    </div>
  );
}
