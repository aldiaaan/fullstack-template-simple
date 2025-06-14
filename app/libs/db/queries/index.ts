import { UAParser } from "ua-parser-js";
import { db } from "../db";
import { authenticatedSessions, users, type PermissionEnum } from "../schema";
import {
  and,
  arrayContains,
  asc,
  count,
  desc,
  eq,
  gt,
  ilike,
  or,
} from "drizzle-orm";

export async function getAuthenticatedSessions(args?: {
  userId?: string; // Made userId optional within the args object as well
}) {
  if (!args?.userId) return [];
  const currentTime = new Date();

  try {
    const sessions = await db.query.authenticatedSessions.findMany({
      where: and(
        eq(authenticatedSessions.userId, args.userId),
        gt(authenticatedSessions.expiresAt, currentTime)
      ),
    });
    return sessions as Array<
      (typeof sessions)[number] & {
        deviceInfo: ReturnType<typeof UAParser>;
      }
    >;
  } catch (error) {
    throw new Error(
      "getAuthenticatedSessions: Failed to retrieve authenticated sessions."
    );
  }
}

export async function getAuthenticatedSession(sessionId: string) {
  return db.query.authenticatedSessions.findFirst({
    where: eq(authenticatedSessions.id, sessionId),
  });
}

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

export async function getUsers(args?: {
  username?: string;
  email?: string;
  permissions?: PermissionEnum[];
  firstName?: string;
  lastName?: string;
  includes?: Array<"sessions">;
  offset?: number;
  limit?: number;
  orders?: {
    createdAt?: "desc" | "asc";
    updatedAt?: "desc" | "asc";
  };
}) {
  const whereConditions = [];

  if (args?.username)
    whereConditions.push(ilike(users.username, `%${args?.username}%`));

  if (args?.email) whereConditions.push(ilike(users.email, `%${args?.email}%`));

  if (args?.firstName)
    whereConditions.push(ilike(users.firstName, `%${args?.firstName}%`));

  if (args?.lastName)
    whereConditions.push(ilike(users.lastName, `%${args?.lastName}%`));

  if (args?.permissions && args?.permissions.length > 0)
    whereConditions.push(arrayContains(users.permissions, args?.permissions));

  const withClause: {
    authenticatedSessions?: true;
  } = {};

  if (args?.includes?.includes("sessions")) {
    Object.assign(withClause, {
      authenticatedSessions: true,
    });
  }

  const orderBy = [];

  if (args?.orders?.createdAt) {
    orderBy.push(
      args?.orders.createdAt === "asc"
        ? asc(users.createdAt)
        : desc(users.createdAt)
    );
  }
  if (args?.orders?.updatedAt) {
    orderBy.push(
      args?.orders.updatedAt === "asc"
        ? asc(users.updatedAt)
        : desc(users.updatedAt)
    );
  }

  const [result, total] = await Promise.all([
    db.query.users.findMany({
      with: withClause,
      where: or(...whereConditions),
      limit: args?.limit,
      offset: args?.offset,
      orderBy: orderBy.length ? orderBy : undefined,
    }),
    await db
      .select({
        count: count(users.id),
      })
      .from(users)
      .where(and(...whereConditions)),
  ]);

  return {
    total: total[0].count,
    users: result.map(({ password, ...rest }) => rest),
  };
}

export async function getUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}
