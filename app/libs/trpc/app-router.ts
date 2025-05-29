import { healthCheckRouter } from "./routers/health-check";
import { router } from "./trpc";

export const appRouter = router({
  health: healthCheckRouter,
});

export type AppRouter = typeof appRouter;
