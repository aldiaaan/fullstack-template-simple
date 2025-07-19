import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "~/libs/trpc/clients/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { RotateCcw, Trash2 } from "lucide-react";

export type BackgroundJobMenuProps = {
  children?: React.ReactNode;
  id: string;
  queue: string;
  onDeleted?: () => void;
  onReset?: () => void;
};

export function BackgroundJobMenu(props: BackgroundJobMenuProps) {
  const { id, children, queue, onReset, onDeleted } = props;

  const [isOpen, setIsOpen] = useState(false);

  const trpc = useTRPC();

  const { mutateAsync: deleteJob, isPending: isDeletingJob } = useMutation(
    trpc.backgroundJobs.jobs.delete.mutationOptions({})
  );

  const { mutateAsync: retryJob, isPending: isRetryingJob } = useMutation(
    trpc.backgroundJobs.jobs.retry.mutationOptions({})
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            onReset?.();
            retryJob({
              jobId: id,
              queue,
            });
          }}
        >
          <RotateCcw />
          Retry
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            deleteJob({
              id,
              queue,
            }).then(() => {
              onDeleted?.();
            });
          }}
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
