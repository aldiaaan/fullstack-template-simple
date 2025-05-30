import { RequestContext } from "~/libs/trpc/request-context";
import type { Route } from "./+types/dashboard";
import { Button } from "~/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/libs/trpc/clients/react";

export async function loader({ request }: Route.LoaderArgs) {
  const context = await RequestContext.fromRequest(request, request.headers);

  return context;
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const trpc = useTRPC();

  const { mutateAsync: logout, isPending } = useMutation(
    trpc.auth.logout.mutationOptions()
  );

  return (
    <div>
      Welcome {loaderData.user?.email} {loaderData.authToken}
      <div>
        <Button isLoading={isPending} onClick={() => logout()}>
          Logout
        </Button>
      </div>
    </div>
  );
}
