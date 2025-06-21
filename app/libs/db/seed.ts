import { config } from "@dotenvx/dotenvx";
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import chalk from "chalk";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

config();

const db = drizzle(process.env.DATABASE_URL, {
  schema,
});

async function main() {
  console.log(chalk.bold.blue("🚀 Starting the database seeder..."));
  console.log(
    chalk.gray(
      `🗓️  Date: ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      })} (WIB)`
    )
  );

  const currentDir = dirname(fileURLToPath(import.meta.url));
  const seedsDir = join(currentDir, "seeds");

  console.log(chalk.cyan(`\n📁 Reading seed files from: ${seedsDir}`));
  const files = await readdir(seedsDir);
  console.log(chalk.cyan(`🔎 Found ${files.length} total files.`));

  const seedScripts = files.filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
  );

  if (seedScripts.length === 0) {
    console.log(chalk.yellow("🤷 No seed scripts found. Exiting."));
    return;
  }

  console.log(chalk.yellow("\n⏳ Beginning database seed transaction..."));
  console.log(await db.query.users.findMany(), process.env.DATABASE_URL);
  // console.log(await db.query.users.findMany());

  // Wrap the entire seeding process in a single transaction
  await db.transaction(async (tx) => {
    console.log(chalk.green("🤝 Transaction started successfully."));

    for (const file of seedScripts) {
      console.log(chalk.bold(`\n--- Executing: ${chalk.cyan(file)} ---`));
      const modulePath = join(seedsDir, file);
      const moduleURL = pathToFileURL(modulePath).href;
      const seedModule = await import(moduleURL);

      // Pass the transaction instance 'tx' to the functions
      if (seedModule.should) {
        console.log("🤔 Checking condition with should()...");
        const shouldRun = await seedModule.should(tx);
        if (!shouldRun) {
          console.log(
            chalk.yellowBright(`↪️ Skipping seed: condition not met.`)
          );
          continue;
        }
        console.log(chalk.green("👍 Condition met. Proceeding to seed."));
      }

      if (seedModule.seed) {
        await seedModule.seed(tx);
        console.log(chalk.green(`🌱 Seeded ${chalk.cyan(file)} successfully.`));
      }
    }
  });

  console.log(
    chalk.bold.green("\n🎉 Seed transaction committed successfully!")
  );
  console.log(chalk.blue("✨ Database is now up-to-date."));
}

main().catch((err) => {
  console.error(
    chalk.bold.red("\n❌ Seed failed. Transaction has been rolled back.")
  );
  console.error(chalk.red("❗️ No changes were made to the database."));
  console.error(err);
  process.exit(1);
});
