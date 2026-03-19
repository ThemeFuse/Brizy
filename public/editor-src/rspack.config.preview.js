const path = require("path");
const rspack = require("@rspack/core");
const ESLintImportedFilesPlugin = require("./build-utils/eslint-imported-files-plugin");
const {
  loadPreviewEslintConfig
} = require("./build-utils/load-eslint-config.cjs");
const editorConfigFn = require("./rspack.config.editor");
const swcrc = require("./swc.config.all");
const LibsConfig = require("./editor/js/bootstraps/libs.json");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

exports.preview = (options) => {
  const editorConfig = editorConfigFn(options);
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");
  const IS_PRODUCTION = options.IS_PRODUCTION;

  return {
    name: "preview",
    mode: editorConfig.mode,
    entry: "./editor/js/bootstraps/preview/index.ts",
    output: {
      path: path.resolve(BUILD_PATH, "editor/js"),
      filename: "preview.min.js",
      chunkFilename: "preview.[name].[contenthash:8].js",
      uniqueName: "brizy_builder_preview_free",
      chunkLoadingGlobal: "webpackChunk_brizy_builder_free"
    },
    resolve: {
      alias: {
        "visual/libs": path.resolve(__dirname, "editor/js/libs"),
        "visual/utils": path.resolve(__dirname, "editor/js/utils"),
        "visual/global": path.resolve(__dirname, "editor/js/global"),
        widget: path.resolve(__dirname, "packages/widget/src")
      },
      extensions: editorConfig.resolve.extensions
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "../packages")
          ],
          use: {
            loader: "swc-loader",
            options: swcrc.preview(options)
          }
        }
      ]
    },
    optimization: {
      usedExports: true,
      minimize: options.IS_PRODUCTION,
      minimizer: [
        new rspack.SwcJsMinimizerRspackPlugin({
          minimizerOptions: {
            compress: {
              drop_console: options.IS_PRODUCTION,
              dead_code: true,
              pure_funcs: options.IS_PRODUCTION
                ? ["console.log", "console.info", "console.debug"]
                : []
            },
            mangle: options.IS_PRODUCTION,
            format: {
              comments: false
            }
          }
        })
      ],
      splitChunks: {
        chunks: "async",
        minSize: 20000, // Minimum size in bytes for a chunk to be generated (20KB)
        minChunks: 1,
        maxAsyncRequests: 30,
        cacheGroups: {
          defaultVendors: false,
          default: false
        }
      }
    },
    externals: {
      jquery: "jQuery"
    },
    performance: {
      hints: options.IS_PRODUCTION ? "warning" : false,
      maxEntrypointSize: 100000,
      maxAssetSize: 100000
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      ...(IS_PRODUCTION
        ? [
            // Custom plugin that only lints files actually imported in the bundle
            // This follows the dependency tree from the entry point and only checks
            // files that are part of the compilation (including dynamic imports)
            new ESLintImportedFilesPlugin({
              context: path.resolve(__dirname, ".."), // Project root to include packages/
              failOnError: true,
              failOnWarning: false,
              configLoader: () => loadPreviewEslintConfig(),
              eslintOptions: {
                overrideConfigFile: true, // Don't load any config files
                cache: false
              }
            })
          ]
        : [])
    ],
    devtool: editorConfig.devtool
  };
};

exports.libs = (options) => {
  const editorConfig = editorConfigFn(options);
  const { free } = LibsConfig;
  const entry = free.reduce((acc, curr) => {
    const { name, path } = curr;
    return { ...acc, [name]: path };
  }, {});

  return {
    name: "libs",
    mode: editorConfig.mode,
    entry: entry,
    output: {
      path: path.resolve(options.BUILD_PATH, "editor/js"),
      filename: "[name].min.js",
      library: "BrizyLibs",
      libraryTarget: "window"
    },
    resolve: {
      extensions: editorConfig.resolve.extensions
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          include: [path.resolve(__dirname, "editor")],
          loader: "swc-loader",
          options: swcrc.preview(options)
        }
      ]
    },
    optimization: {
      minimize: options.IS_PRODUCTION,
      minimizer: [
        new rspack.SwcJsMinimizerRspackPlugin({
          minimizerOptions: {
            compress: {
              drop_console: options.IS_PRODUCTION,
              dead_code: true,
              pure_funcs: options.IS_PRODUCTION
                ? ["console.log", "console.info", "console.debug"]
                : []
            },
            mangle: options.IS_PRODUCTION,
            format: {
              comments: false
            }
          }
        })
      ]
    },
    externals: editorConfig.externals,
    performance: {
      hints: false
    },
    devtool: editorConfig.devtool
  };
};
