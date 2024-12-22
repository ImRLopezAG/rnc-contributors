import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "lib",
  minify: true,
  treeshake: true,
  clean: true,
  splitting: false,
  format: ["esm"],
  injectStyle: false,
  bundle: true,
});