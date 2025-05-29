import { appRouter } from "./app-router";
import { RequestContext } from "./request-context";
import { createCallerFactory } from "./trpc";

export const createCaller = async (request: Request) => {
  const factory = createCallerFactory(appRouter);

  return factory(await RequestContext.fromRequest(request));
};
