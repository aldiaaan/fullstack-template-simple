import { RequestContext } from "~/libs/trpc/request-context";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  const context = await RequestContext.fromRequest(request, request.headers);

  return context;
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  return <div>Welcome {loaderData.user?.email}</div>;
}
