import { cva } from "class-variance-authority";
import { JobStatuses } from "~/libs/background-jobs/constants";

const jobStatusVariants = cva(
  "text-sm px-2.5 rounded-md tracking-tight py-1 font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-50 text-gray-600 border border-gray-300",
        good: "bg-green-50 text-green-600 border border-green-300",
        danger: "bg-red-50 text-red-600 border border-red-300",
        warning: "bg-yellow-50 text-yellow-600 border border-yello-300",
        loading: "bg-indigo-50 text-indigo-600 border border-indigo-300",
        outline:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function JobStatus(props?: { status?: JobStatuses }) {
  function getVariant(status?: JobStatuses) {
    switch (status) {
      case JobStatuses.ACTIVE:
        return "loading";
      case JobStatuses.COMPLETED:
        return "good";
      case JobStatuses.FAILED:
        return "danger";
      case JobStatuses.PAUSED:
      case JobStatuses.ABORTED:
      case JobStatuses.DELAYED:
        return "warning";
      default:
        return "default";
    }
  }

  function renderLabel(status?: JobStatuses) {
    switch (status) {
      case JobStatuses.ACTIVE:
        return "In Progress";
      case JobStatuses.COMPLETED:
        return "Completed";
      case JobStatuses.DELAYED:
        return "Delayed";
      case JobStatuses.FAILED:
        return "Failed";
      case JobStatuses.LATEST:
        return "Latest";
      case JobStatuses.PAUSED:
        return "Paused";
      case JobStatuses.PRIORITIZED:
        return "Prioritized";
      case JobStatuses.WAITING:
        return "Waiting";
      case JobStatuses.WAITING_CHILDREN:
        return "Waiting Children";
      case JobStatuses.ABORTED:
        return "Aborted";
      default:
        return "Unknown Status";
    }
  }

  return (
    <span className={jobStatusVariants({ variant: getVariant(props?.status) })}>
      {renderLabel(props?.status)}
    </span>
  );
}
