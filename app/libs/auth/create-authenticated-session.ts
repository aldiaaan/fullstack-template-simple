import { encodeHexLowerCase } from "@oslojs/encoding";
import { authenticatedSessions, type AuthenticatedSession } from "../db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "../db/db";
import { DEFAULT_SESSION_LIFETIME } from "~/constants";

export type CreateSessionReturn = {
  expiresAt: Date;
  id: string;
  userId: string;
  token: string;
};

export async function createAuthenticatedSession(
  token: string,
  userId: string
): Promise<CreateSessionReturn> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const expiresAt = new Date(Date.now() + DEFAULT_SESSION_LIFETIME);

  await db.insert(authenticatedSessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  return {
    expiresAt,
    token,
    id: sessionId,
    userId,
  };
}
