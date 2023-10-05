const esbuild = require("esbuild");
const path = require("path");

const argv_ = require("minimist")(process.argv.slice(2));

const IS_PRODUCTION = Boolean(argv_.production);
const WATCH = Boolean(argv_.watch);

const define = {
  "process.env": JSON.stringify("{}"),
  "process.env.IS_PRODUCTION": JSON.stringify(IS_PRODUCTION)
};

const paths = {
  src: path.resolve("./src") ?? argv_.src,
  build: path.resolve("./build") ?? argv_.build
};

esbuild
  .build({
    entryPoints: [`${paths.src}/index.ts`],
    outfile: `${paths.build}/index.js`,
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
      console.log("WP API Client: ⚾ Watching for changes...");
    } else {
      console.log("WP API Client: ⚡ Done");
    }
  })
  .catch(() => process.exit(1));
