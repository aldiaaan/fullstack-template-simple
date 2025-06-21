import { createCookieSessionStorage, type SessionStorage } from "react-router";

export type AuthSessionStorageData = {
  token: string;
  "impersonate.token"?: string;
};

export const authSessionStorage =
  createCookieSessionStorage<AuthSessionStorageData>({
    cookie: {
      name: "__auth",
      secrets: [process.env.COOKIE_SECRET],
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  });
