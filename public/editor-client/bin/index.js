const esbuild = require("esbuild");

const argv_ = require("minimist")(process.argv.slice(2));

const IS_PRODUCTION = Boolean(argv_.production);
const WATCH = Boolean(argv_.watch);

const define = {
  "process.env.IS_PRODUCTION": JSON.stringify(IS_PRODUCTION),
};

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "build/index.js",
    bundle: true,
    loader: { ".ts": "ts" },
    minify: IS_PRODUCTION,
    watch: WATCH,
    sourcemap: IS_PRODUCTION ? false : "inline",
    format: "iife",
    define: define,
  })
  .then(() => console.log("⚡ Done"))
  .catch(() => process.exit(1));
