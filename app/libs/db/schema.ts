import { relations, sql, type InferSelectModel } from "drizzle-orm";
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
export const permissionEnum = pgEnum("permission", ["read:all", "write:all"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 32 }).notNull(),
  role: roleEnum(),
  permissions: permissionEnum().array().default([]),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const authenticatedSessions = pgTable("authenticatedSessions", {
  id: text().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  expiresAt: timestamp({
    mode: "date",
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp().defaultNow(),
  deviceInfo: json(),
  userAgent: text(),
  ip: text(),
});

export const usersRelations = relations(users, ({ many }) => ({
  authenticatedSessions: many(authenticatedSessions),
}));

export const authenticatedSessionRelations = relations(
  authenticatedSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [authenticatedSessions.userId],
      references: [users.id],
    }),
  })
);

export type User = InferSelectModel<typeof users>;
export type AuthenticatedSession = InferSelectModel<
  typeof authenticatedSessions
>;

export type RoleEnum = (typeof roleEnum.enumValues)[number];
export type PermissionEnum = (typeof permissionEnum.enumValues)[number];
