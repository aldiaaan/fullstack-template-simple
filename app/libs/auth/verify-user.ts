import { eq } from "drizzle-orm";
import { verify } from "@node-rs/argon2";
import { db } from "../db/db";
import { users } from "../db/schema";

export type VerifyUserArgs = {
  email: string;
  password: string;
};

export async function verifyUser(args: VerifyUserArgs) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, args.email));

  const user = result[0];

  if (!user) return null;

  if (!verify(user.password, args.password)) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}
