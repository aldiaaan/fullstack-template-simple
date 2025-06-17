import { Outlet } from "react-router";
import { authSessionStorage } from "~/sessions/auth";
import type { Route } from "./+types/layout";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (session.get("token")) return redirect("/dashboard");
}

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Outlet />
      </div>
    </div>
  );
}
