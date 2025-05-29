import { config } from "@dotenvx/dotenvx";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import * as schema from "./schema";

config();

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await reset(db, schema);
}

main().catch((err) => {
  console.error("❌ Reset failed");
  console.error(err);
  process.exit(1);
});
