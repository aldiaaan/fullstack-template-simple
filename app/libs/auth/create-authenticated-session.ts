import { encodeHexLowerCase } from "@oslojs/encoding";
import { authenticatedSessions, type AuthenticatedSession } from "../db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "../db/db";
import { DEFAULT_SESSION_LIFETIME } from "~/constants";
import { UAParser } from "ua-parser-js";
import type { RequestContext } from "../trpc/request-context";

export type CreateSessionReturn = {
  expiresAt: Date;
  id: string;
  userId: string;
  token: string;
};

export async function createAuthenticatedSession(
  token: string,
  userId: string,
  ctx: RequestContext
): Promise<CreateSessionReturn> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const expiresAt = new Date(Date.now() + DEFAULT_SESSION_LIFETIME);

  let device = {} as ReturnType<typeof UAParser>;

  const userAgent =
    ctx.request.headers.get("User-Agent") ||
    ctx.request.headers.get("User-Agent");

  if (userAgent) {
    device = UAParser(userAgent);
  }

  // remove ua key value from parser
  const { ua, ...deviceInfo } = device;

  await db.insert(authenticatedSessions).values({
    id: sessionId,
    userId,
    expiresAt,
    deviceInfo,
    userAgent: ua,
  });

  return {
    expiresAt,
    token,
    id: sessionId,
    userId,
  };
}
