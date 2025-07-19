import { redirect } from "react-router";
import { queueNames } from "~/libs/background-jobs/constants";

export function loader() {
  return redirect(`/dashboard/background-jobs/queues/${queueNames[0]}/jobs`);
}
