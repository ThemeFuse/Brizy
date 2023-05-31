const esbuild = require("esbuild");

const argv_ = require("minimist")(process.argv.slice(2));
const IS_PRODUCTION = Boolean(argv_.production);
const WATCH = Boolean(argv_.watch);

const define = {
  "process.env": JSON.stringify("{}"),
  "process.env.IS_PRODUCTION": JSON.stringify(IS_PRODUCTION)
};

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    loader: { ".ts": "ts" },
    minify: IS_PRODUCTION,
    watch: WATCH,
    sourcemap: IS_PRODUCTION ? false : "inline",
    format: "iife",
    define
  })
  .then(() => {
    if (WATCH) {
      console.log("Cloud API Client: ⚾ Watching for changes...");
    } else {
      console.log("Cloud API Client: ⚡ Done");
    }
  })
  .catch(() => process.exit(1));
