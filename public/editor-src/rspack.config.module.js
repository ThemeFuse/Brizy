const path = require("path");
const fs = require("fs");
const rspack = require("@rspack/core");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { omit } = require("timm");
const {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator
} = require("resolve-url-loader");
const swcrc = require("./swc.config.all");
const rootPackage = require("./package.json");

// Custom plugin to generate JSON files (replaces generate-json-webpack-plugin)
class GenerateJsonPlugin {
  constructor(filename, json, replacer, space) {
    this.filename = filename;
    this.json = json;
    this.replacer = replacer;
    this.space = space;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap("GenerateJsonPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "GenerateJsonPlugin",
          stage: rspack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        () => {
          const json =
            typeof this.json === "function" ? this.json() : this.json;
          const content = JSON.stringify(json, this.replacer, this.space);

          compilation.emitAsset(
            this.filename,
            new rspack.sources.RawSource(content)
          );
        }
      );
    });
  }
}

// Custom plugin to generate TypeScript declarations (replaces fork-ts-checker-webpack-plugin)
class TypeScriptDeclarationPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(
      "TypeScriptDeclarationPlugin",
      async () => {
        try {
          const { spawn } = require("child_process");
          const { include, compilerOptions } = this.options;

          // Create a temporary tsconfig for declaration generation
          const tsconfigPath = path.resolve(
            __dirname,
            "tsconfig.declarations.temp.json"
          );
          const tsconfigContent = JSON.stringify(
            {
              include,
              compilerOptions: {
                ...compilerOptions,
                emitDeclarationOnly: true
              }
            },
            null,
            2
          );

          fs.writeFileSync(tsconfigPath, tsconfigContent);

          return new Promise((resolve, reject) => {
            const tsc = spawn("npx", ["tsc", "--project", tsconfigPath], {
              cwd: __dirname,
              stdio: "inherit"
            });

            tsc.on("close", (code) => {
              // Clean up temp config
              try {
                fs.unlinkSync(tsconfigPath);
              } catch (e) {
                // Ignore cleanup errors
                console.error(e);
              }

              if (code !== 0) {
                //eslint-disable-next-line no-console
                console.warn(
                  `TypeScript declaration generation exited with code ${code}`
                );
              }
              resolve();
            });

            tsc.on("error", (err) => {
              console.error("Failed to generate TypeScript declarations:", err);
              reject(err);
            });
          });
        } catch (error) {
          console.error("Error in TypeScriptDeclarationPlugin:", error);
          return Promise.resolve();
        }
      }
    );
  }
}

const defaultExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

const packageJSON = {
  ...omit(rootPackage, ["dependencies", "scripts"]),
  exports: {
    ".": {
      default: {
        types: "./dist/editor/index.d.ts",
        default: "./dist/editor/index.js"
      }
    },
    "./*.css": "./dist/css/*.css",
    "./preview": {
      types: "./dist/editor/types/preview.d.ts",
      default: "./dist/preview.js"
    },
    "./editor": {
      types: "./dist/editor/index.d.ts",
      default: "./dist/editor/index.js"
    }
  },
  peerDependencies: {
    react: rootPackage.dependencies["react"],
    "react-dom": rootPackage.dependencies["react-dom"]
  }
};

const sassDirectory = path.resolve(__dirname, "editor/sass");
const docsDirectory = path.resolve(__dirname, "../docs");

const fontsGenerator = asGenerator((item, ...rest) => {
  const defaultGenerator = defaultJoinGenerator(item, ...rest);

  if (item.bases.selector.includes("/node_modules/")) {
    return [...defaultGenerator];
  }

  return [
    ...defaultGenerator,
    path.resolve(sassDirectory, "editor", "fonts"),
    path.basename(item.uri)
  ];
});

const myJoinFn = createJoinFunction(
  "joinFnForFonts",
  createJoinImplementation(fontsGenerator)
);

const getExtensions = (target) => {
  switch (target) {
    case "WP": {
      return [
        ".preview.wp.ts",
        ".preview.wp.tsx",
        ".preview.wp.js",
        ".preview.wp.jsx",
        ".preview.ts",
        ".preview.tsx",
        ".preview.js",
        ".preview.jsx",
        ".wp.ts",
        ".wp.tsx",
        ".wp.js",
        ".wp.jsx",
        ...defaultExtensions
      ];
    }
    default: {
      return [
        ".preview.ts",
        ".preview.tsx",
        ".preview.js",
        ".preview.jsx",
        ...defaultExtensions
      ];
    }
  }
};

const rspackConfig = (options) => {
  const BUILD_PATH = options.BUILD_PATH;
  const BUILD_MODE = options.IS_PRODUCTION ? "production" : "development";
  const distPath = path.resolve(BUILD_PATH, "dist");

  return {
    mode: BUILD_MODE,
    output: {
      path: distPath,
      filename: "[name].js",
      publicPath: "",
      globalObject: "this",
      library: {
        name: packageJSON.name,
        type: "umd",
        umdNamedDefine: true
      }
    },
    resolve: {
      alias: {
        visual: path.resolve(__dirname, "editor/js"),
        sass: path.resolve(__dirname, "editor/sass")
      },
      extensions: getExtensions(options.TARGET)
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "../packages")
          ],
          use: {
            loader: "swc-loader",
            options: swcrc.module(options)
          }
        },

        {
          test: /\.s[ac]ss$/i,
          use: [
            { loader: rspack.CssExtractRspackPlugin.loader },
            { loader: "css-loader" },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer"]
                }
              }
            },
            {
              loader: "resolve-url-loader",
              options: {
                join: myJoinFn
              }
            },
            {
              loader: "sass-loader",
              options: {
                // !!IMPORTANT!! used inside "resolve-url-loader"
                sourceMap: true,
                sassOptions: {
                  silenceDeprecations: ["legacy-js-api"]
                }
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            publicPath: "fonts/",
            outputPath: "fonts"
          }
        }
      ]
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: false
        }
      }
    },
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
    },
    plugins: [
      new rspack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      new rspack.CssExtractRspackPlugin({
        filename: "css/[name].css"
      }),
      ...(options.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
    ],
    devtool: options.IS_PRODUCTION ? false : "eval-cheap-module-source-map",
    performance: {
      hints: false
    }
  };
};

const rspackPreviewConfig = (options) => {
  const baseConfig = rspackConfig(options);

  return {
    ...baseConfig,
    entry: {
      preview: "./editor/js/bootstraps/module/index.tsx"
    },
    module: {
      ...baseConfig.module,
      rules: [
        ...baseConfig.module.rules,
        {
          test: /[\\/](lib|screenshot)s?[\\/]/,
          include: [path.resolve(__dirname, "editor")],
          loader: "null-loader"
        }
      ]
    },
    plugins: [
      ...baseConfig.plugins,
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(baseConfig.mode),
        TARGET: JSON.stringify(options.TARGET)
      })
    ]
  };
};

const rspackEditorConfig = (options) => {
  const baseConfig = rspackConfig(options);
  const outputDir = path.resolve(baseConfig.output.path, "editor");

  return {
    ...baseConfig,
    entry: {
      editor: "./editor/opensource/index.ts"
    },
    output: {
      ...baseConfig.output,
      path: outputDir,
      filename: "index.js"
    },
    plugins: [
      ...baseConfig.plugins,
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(baseConfig.mode),
        BUILD_VERSION: JSON.stringify(options.BUILD_VERSION)
      }),
      new GenerateJsonPlugin("../../package.json", packageJSON, (_, v) => v, 2),
      new rspack.CopyRspackPlugin({
        patterns: [
          {
            from: path.resolve(docsDirectory, "README.opensource.md"),
            to: "../../README.md"
          }
        ]
      }),
      new TypeScriptDeclarationPlugin({
        include: [
          "./editor/opensource/**/*.ts",
          "./editor/opensource/**/*.tsx"
        ],
        compilerOptions: {
          baseUrl: "./editor/opensource",
          outDir: outputDir,
          declaration: true
        }
      })
    ]
  };
};

module.exports = (env, argv) => {
  const options = {
    TARGET: "Cloud",
    WATCH: argv.watch ?? false,
    IS_PRODUCTION: argv.mode === "production",
    BUILD_PATH: env["build-dir"] ?? path.resolve(__dirname, "build")
  };
  const previewConfig = rspackPreviewConfig({
    ...options,
    ANALYZE: env["analyze_preview"] ?? false
  });
  const editorConfig = rspackEditorConfig({
    ...options,
    BUILD_VERSION: env["version"] ?? "dev",
    ANALYZE: env["analyze_editor"] ?? false
  });

  return [previewConfig, editorConfig];
};
