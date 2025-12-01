const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const editorConfigFn = require("./webpack.config.editor");
const swcrc = require("./swc.config.all");
const LibsConfig = require("./editor/js/bootstraps/libs.json");

exports.preview = (options) => {
  const editorConfig = editorConfigFn(options);

  return {
    mode: editorConfig.mode,
    entry: "./editor/js/bootstraps/preview/index.js",
    output: {
      ...editorConfig.output,
      filename: "preview.min.js"
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
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: options.IS_PRODUCTION,
              dead_code: true,
              pure_funcs: options.IS_PRODUCTION ? ['console.log', 'console.info', 'console.debug'] : []
            },
            mangle: options.IS_PRODUCTION,
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    },
    externals: {
      jquery: "jQuery"
    },
    performance: {
      hints: options.IS_PRODUCTION ? "warning" : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    devtool: editorConfig.devtool,
    watch: editorConfig.watch
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
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    },
    externals: editorConfig.externals,
    performance: {
      hints: false
    },
    devtool: editorConfig.devtool,
    watch: editorConfig.watch
  };
};
