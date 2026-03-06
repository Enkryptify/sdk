import { resolve } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    treeshake: true,
    sourcemap: true,
    esbuildOptions(options) {
        options.alias = {
            "@": resolve("src"),
        };
    },
});
