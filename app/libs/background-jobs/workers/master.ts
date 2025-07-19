import fs from "fs/promises"; // Use the promise-based version for async/await
import path from "path";
import { fileURLToPath } from "url";
import { redis2 } from "~/libs/redis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentFileName = path.basename(__filename);

async function main() {
  console.log("Starting workers discovery...");

  const files = await fs.readdir(__dirname);

  console.log("Setup job abort listener");
  await redis2.psubscribe("*");

  await Promise.all(
    files
      .filter((file) => {
        return (
          (file.endsWith(".ts") || !file.endsWith(".d.ts")) &&
          file !== currentFileName
        );
      })
      .map(async (file) => {
        try {
          const modulePath = `./${file}`; // Relative path is required for dynamic import
          const importedModule = await import(modulePath);
          const moduleName = file.replace(".ts", "");
          console.log(`Loaded workers: ${moduleName}`);
          return importedModule.worker.run();
        } catch (error) {
          console.error(`Failed to import module ${file}:`, error);
        }
      })
  );

  console.log("Module discovery finished.");
}

main()
  .then(() => {
    console.log("\n✅ All modules loaded successfully!");
  })
  .catch((error) => {
    console.error("\n❌ An error occurred during module loading:", error);
  })
  .finally(() => {
    redis2.unsubscribe();
  });
