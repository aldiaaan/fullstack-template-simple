import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "../db/db";
import { authenticatedSessions, users } from "../db/schema";
import {
  extendAuthenticatedSession,
  invalidateAuthenticatedSession,
} from "../db/mutations";

export type ValidateSessionTokenReturn = {
  id: string;
  user: {
    firstName: string;
    lastName: string | null;
    email: string;
    id: string;
  };
  expiresAt: Date;
};

export async function validateSessionToken(
  token: string
): Promise<ValidateSessionTokenReturn | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({ user: users, authenticatedSession: authenticatedSessions })
    .from(authenticatedSessions)
    .innerJoin(users, eq(authenticatedSessions.userId, users.id))
    .where(eq(authenticatedSessions.id, sessionId));

  if (result.length < 1) {
    return null;
  }

  const { user, authenticatedSession } = result[0];

  if (Date.now() >= authenticatedSession.expiresAt.getTime()) {
    await invalidateAuthenticatedSession(authenticatedSession.id);
    return null;
  }

  if (
    Date.now() >=
    authenticatedSession.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
  ) {
    authenticatedSession.expiresAt = await extendAuthenticatedSession(
      authenticatedSession.id
    );
  }

  return {
    expiresAt: authenticatedSession.expiresAt,
    id: authenticatedSession.id,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
    },
  };
}
