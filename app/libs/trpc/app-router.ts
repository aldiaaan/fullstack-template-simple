import { authRouter } from "./routers/auth";
import { healthCheckRouter } from "./routers/health-check";
import { router } from "./trpc";

export const appRouter = router({
  health: healthCheckRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
