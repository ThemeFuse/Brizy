import ESBuild from "esbuild";
import path from "path";

const mode = process.env.MODE || "development";

const isDev = mode === "development";
const isProd = mode === "production";

function resolveRoot(...segments: string[]) {
  return path.resolve(__dirname, "..", "..", ...segments);
}

ESBuild.build({
  outdir: resolveRoot("build"),
  entryPoints: [resolveRoot("src", "index.tsx")],
  entryNames: "index",
  allowOverwrite: true,
  bundle: true,
  tsconfig: resolveRoot("tsconfig.json"),
  minify: isProd,
  sourcemap: isDev,
  loader: {
    ".png": "file",
    ".svg": "text",
    ".jpg": "file"
  }
});
