import type { ActionFunctionArgs } from "react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/libs/trpc/app-router";
import { RequestContext } from "~/libs/trpc/request-context";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const response = await fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/trpc",
    batching: { enabled: true },
    createContext(opts) {
      return RequestContext.fromRequest(opts.req, opts.resHeaders);
    },
    onError(opts) {
      const { error, ctx } = opts;
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`${ctx?.id} | `, error.message);
      }
    },
  });

  return response;
};

export const loader = action;
