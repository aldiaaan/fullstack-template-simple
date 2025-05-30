import { db } from "../db/db";
import { checkIfusernameExists } from "../db/queries";
import { hash } from "@node-rs/argon2";
import { users } from "../db/schema";

export type CreateAccountArgs = {
  email: string;
  password: string;
  username?: string;
  firstName: string;
  lastName?: string;
};

function generateRandomUsername(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createAccount(newAccount: CreateAccountArgs) {
  const { email, firstName, lastName } = newAccount;

  let username = newAccount.username;

  const password = await hash(newAccount.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const RANDOM_USERNAME_LENGTH = 12;

  let retries = 0;

  if (!username) {
    while (retries < 5) {
      username = generateRandomUsername(RANDOM_USERNAME_LENGTH);
      if (await checkIfusernameExists(username)) {
        retries++;
      } else {
        break;
      }
    }

    if (!username) throw new Error("Failed to generate username");
  }

  const createdAccount = await db
    .insert(users)
    .values({
      email,
      firstName,
      lastName,
      password,
      username,
    })
    .returning();

  return createdAccount[0];
}
