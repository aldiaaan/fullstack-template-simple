import type { InferSelectModel } from "drizzle-orm";
import {
  uuid,
  pgTable,
  varchar,
  pgEnum,
  timestamp,
  text,
  json,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["SUPERADMIN"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 32 }).notNull(),
  role: roleEnum(),
});

export const authenticatedSessions = pgTable("authenticatedSessions", {
  id: text().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp({
    mode: "date",
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp().defaultNow(),
  deviceInfo: json(),
  userAgent: text(),
});

export type User = InferSelectModel<typeof users>;
export type AuthenticatedSession = InferSelectModel<
  typeof authenticatedSessions
>;

export type RoleEnum = (typeof roleEnum.enumValues)[number];
