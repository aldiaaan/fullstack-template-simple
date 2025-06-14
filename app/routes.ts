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
      index("routes/user/dashboard/dashboard.tsx"),
      route("users", "routes/user/dashboard/users.tsx"),
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
