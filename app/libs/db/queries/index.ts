import { db } from "../db";
import { authenticatedSessions, users } from "../schema";
import { eq } from "drizzle-orm";

export async function checkIfusernameExists(
  username: string
): Promise<boolean> {
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return existingUsers.length > 0;
}
