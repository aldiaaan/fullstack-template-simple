import { procedure, router } from "../trpc";

export const healthCheckRouter = router({
  ping: procedure.query(() => {
    return "pong";
  }),
});
