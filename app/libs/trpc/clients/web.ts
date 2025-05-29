import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../app-router";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:5173/trpc",
    }),
  ],
});
