import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/trpc/*", "routes/trpc.tsx"),
  layout("routes/auth/layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),
  ...prefix("dashboard", [
    layout("routes/user/dashboard/layout.tsx", [
      route(
        "/background-jobs/queues/:name/jobs/:jobId",
        "routes/user/dashboard/background-jobs/jobs/details.tsx"
      ),
      index("routes/user/dashboard/dashboard.tsx"),
      route("users", "routes/user/dashboard/users.tsx"),
      ...prefix("background-jobs", [
        index("routes/user/dashboard/background-jobs/home.tsx"),
        ...prefix("queues", [
          layout(
            "routes/user/dashboard/background-jobs/queues/queue-details.tsx",
            [
              route(
                ":name",
                "routes/user/dashboard/background-jobs/queues/home.tsx"
              ),
              route(
                ":name/jobs",
                "routes/user/dashboard/background-jobs/queues/jobs.tsx"
              ),
              route(
                ":name/schedulers",
                "routes/user/dashboard/background-jobs/queues/schedulers.tsx"
              ),
            ]
          ),
        ]),
      ]),
      ...prefix("settings", [
        layout("routes/user/dashboard/settings/settings.tsx", [
          index("routes/user/dashboard/settings/home.tsx"),
          route("profile", "routes/user/dashboard/settings/profile.tsx"),
          route("security", "routes/user/dashboard/settings/security.tsx"),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
