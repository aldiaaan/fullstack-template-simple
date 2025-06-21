import { useMatches } from "react-router";
import type { RequestContext } from "~/libs/trpc/request-context";

export function useUser() {
  const matches = useMatches();

  const match = matches.find((m) => m.id === "root");

  return (match?.data as RequestContext | undefined)?.user;
}
