import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { singleton } from "../../utils/singleton";

export const db = singleton("db", () =>
  drizzle(process.env.DATABASE_URL, { schema })
);
