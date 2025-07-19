import type { Job } from "bullmq";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

let _cache: {
  [key: string]: (job: Job, abortController: AbortController) => void;
} | null = null;

export async function getProcessors() {
  if (_cache) return _cache;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  console.log("Starting processors discovery...");
  const currentFileName = path.basename(__filename);

  const files = await fs.readdir(path.join(__dirname, "../processors"));

  const modulesMap = {} as { [key: string]: (job: Job) => void };

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
          const importedModule = await import(`../processors/${file}`);
          const moduleName = importedModule.name;

          modulesMap[moduleName] = importedModule.process;

          console.log(`Loaded processors: ${moduleName}`);
        } catch (error) {
          console.error(`Failed to import module ${file}:`, error);
        }
      })
  );

  _cache = modulesMap;

  return _cache;
}
