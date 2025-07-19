import { authRouter } from "./routers/auth";
import { backgroundJobsRouter } from "./routers/background-jobs";
import { healthCheckRouter } from "./routers/health-check";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  health: healthCheckRouter,
  auth: authRouter,
  user: userRouter,
  backgroundJobs: backgroundJobsRouter,
});

export type AppRouter = typeof appRouter;
