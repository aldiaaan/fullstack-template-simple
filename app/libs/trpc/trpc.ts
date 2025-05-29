import { initTRPC } from "@trpc/server";

export const { middleware, procedure, router, createCallerFactory } =
  initTRPC.create();

