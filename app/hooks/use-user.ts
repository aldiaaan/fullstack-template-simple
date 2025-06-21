import { useMatches, useNavigate } from "react-router";
import type { RequestContext } from "~/libs/trpc/request-context";

export function useUser() {
  const matches = useMatches();

  const navigate = useNavigate();

  const match = matches.find((m) => m.id === "root");

  const user = (match?.data as RequestContext | undefined)?.user;

  if (!user) {
    throw new Error("");
  }

  return user;
}
