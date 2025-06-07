import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { authenticatedSessions, users } from "../schema";

export async function invalidateAuthenticatedSession(
  sessionId: string
): Promise<void> {
  await db
    .delete(authenticatedSessions)
    .where(eq(authenticatedSessions.id, sessionId));
}

export async function invalidateAllAuthenticatedSessions(
  userId: string
): Promise<void> {
  await db
    .delete(authenticatedSessions)
    .where(eq(authenticatedSessions.userId, userId));
}

export async function extendAuthenticatedSession(sessionId: string) {
  const newDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await db
    .update(authenticatedSessions)
    .set({
      expiresAt: newDate,
    })
    .where(eq(authenticatedSessions.id, sessionId));

  return newDate;
}

export async function deleteUsers(ids: string[] = []) {
  if (ids.length === 0) return true;

  await db.delete(users).where(inArray(users.id, ids));
}
