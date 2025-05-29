import { config } from "@dotenvx/dotenvx";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";

config();

const db = drizzle(process.env.DATABASE_URL!);

async function main() {}

main().catch((err) => {
  console.error("❌ Seed failed");
  console.error(err);
  process.exit(1);
});
