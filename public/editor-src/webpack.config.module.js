const path = require("path");
const webpack = require("webpack");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { omit } = require("timm");
const {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator
} = require("resolve-url-loader");
const swcrc = require("./swc.config.all");
const rootPackage = require("./package.json");

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

const webpackConfig = (options) => {
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
        visual: path.resolve(__dirname, "editor/js")
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
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer", "tailwindcss"]
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
                sourceMap: true
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
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      new MiniCssExtractPlugin({
        filename: "css/[name].css"
      }),
      ...(options.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
    ],
    devtool: options.IS_PRODUCTION ? false : "eval-cheap-module-source-map",
    watch: options.WATCH && !options.IS_PRODUCTION
  };
};

const webpackPreviewConfig = (options) => {
  const baseConfig = webpackConfig(options);

  return {
    ...baseConfig,
    entry: {
      preview: "./editor/js/bootstraps/module/index.tsx",
      previewCSS: "./editor/sass/main.export.pro.scss"
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
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(baseConfig.mode),
        TARGET: JSON.stringify(options.TARGET)
      })
    ]
  };
};

const webpackEditorConfig = (options) => {
  const baseConfig = webpackConfig(options);
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
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(baseConfig.mode),
        BUILD_VERSION: JSON.stringify(options.BUILD_VERSION)
      }),
      new GenerateJsonPlugin("../../package.json", packageJSON, (_, v) => v, 2),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(docsDirectory, "README.opensource.md"),
            to: "../../README.md"
          }
        ]
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          mode: "write-dts",
          configOverwrite: {
            include: [
              "./editor/opensource/**/*.ts",
              "./editor/opensource/**/*.tsx"
            ],
            compilerOptions: {
              baseUrl: "./editor/opensource",
              outDir: outputDir,
              declaration: true
            }
          }
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
  const previewConfig = webpackPreviewConfig({
    ...options,
    ANALYZE: env["analyze_preview"] ?? false
  });
  const editorConfig = webpackEditorConfig({
    ...options,
    BUILD_VERSION: env["version"] ?? "dev",
    ANALYZE: env["analyze_editor"] ?? false
  });

  return [previewConfig, editorConfig];
};
