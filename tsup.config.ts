import { type Options, defineConfig } from "tsup";

export function config(opts: Options): Options {
  return {
    entry: opts.entry,
    format: ["cjs", "esm"],
    target: ["node16"],
    outDir: "build/workers",
    dts: true,
    sourcemap: true,
    clean: true,
  };
}

export default defineConfig([
  config({
    entry: ["app/libs/background-jobs/workers/**/*"],
  }),
]);
