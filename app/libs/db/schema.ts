import type { InferSelectModel } from "drizzle-orm";
import { uuid, pgTable, varchar, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["SUPERADMIN"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 32 }).notNull(),
  role: roleEnum(),
});

export type User = InferSelectModel<typeof users>;

export type RoleEnum = typeof roleEnum.enumValues[number]
