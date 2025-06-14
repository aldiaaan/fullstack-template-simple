import { initTRPC } from "@trpc/server";
import type { RequestContext } from "./request-context";
import { ClientError } from "~/errors";
import { IS_DEV } from "~/constants";

export const { middleware, procedure, router, createCallerFactory } = initTRPC
  .context<RequestContext>()
  .create({
    errorFormatter: (options) => {
      const { shape, error, ctx } = options;

      if (error instanceof ClientError) {
        return shape;
      } else {
        return {
          ...shape,
          message: `Something went wrong please try again later (${ctx?.id})`,
          data: {
            ...shape.data,
            stack: IS_DEV ? shape.data.stack : "",
          },
        };
      }
    },
  });
