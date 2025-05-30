import { initTRPC } from "@trpc/server";
import type { RequestContext } from "./request-context";

export const { middleware, procedure, router, createCallerFactory } = initTRPC
  .context<RequestContext>()
  .create();
