import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, Outlet, useLoaderData, useParams } from "react-router";
import { CreateJobDialog } from "~/components/create-job-dialog";
import { DashboardSectionHeader } from "~/components/dashboard/section-header";
import { DashboardSectionMain } from "~/components/dashboard/section-main";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SidebarInset } from "~/components/ui/sidebar";
import { configV2 } from "~/libs/background-jobs/constants";
import { useTRPC } from "~/libs/trpc/clients/react";

export function loader() {
  return {
    config: configV2,
  };
}

function Actions() {
  const { config } = useLoaderData<typeof loader>();

  const trpc = useTRPC();

  const { mutateAsync: addJob } = useMutation(
    trpc.backgroundJobs.jobs.add.mutationOptions()
  );

  const params = useParams<{ name: string }>();

  const [selectedQueue, setSelectedQueue] = useState(
    params.name || config.queues[0].name
  );

  return (
    <div className="flex gap-2">
      {/* <Navigate to="" /> */}
      <Select
        defaultValue={params.name}
        value={selectedQueue}
        onValueChange={setSelectedQueue}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.values(config.queues).map((q) => (
              <SelectItem value={q.name} key={q.name}>
                {q.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <CreateJobDialog queue={selectedQueue} config={config}>
        <Button>Create Job</Button>
      </CreateJobDialog>
    </div>
  );
}

export default function BackgroundJobsHomePage() {
  const { name: queueName } = useParams<{ name: string }>();

  return (
    <SidebarInset>
      <DashboardSectionHeader
        tabs={[
          {
            href: `/dashboard/background-jobs/queues/${queueName}/jobs`,
            key: "jobs",
            label: "Jobs",
          },
          {
            href: `/dashboard/background-jobs/queues/${queueName}/schedulers`,
            key: "scheduler",
            label: "Schedulers",
          },
        ]}
        actions={Actions}
        title="Background Jobs"
      />

      <DashboardSectionMain>
        <Outlet />
      </DashboardSectionMain>
    </SidebarInset>
  );
}
