import { initTRPC } from "@trpc/server";

export const { middleware, procedure, router } = initTRPC.create();
