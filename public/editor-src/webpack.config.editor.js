const path = require("path");
const webpack = require("webpack");
const WorkerPlugin = require("worker-plugin");
const babelrc = require("./babelrc.config.all");

const getExtensions = target => {
  const defaultExtensions = [".js", ".jsx", ".json"];

  switch (target) {
    case "WP":
      return [".wp.js", ".wp.jsx", ...defaultExtensions];
    default:
      return defaultExtensions;
  }
};

module.exports = (options = {}) => {
  // extracted variable to make phpstorm work with aliases
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");

  return {
    mode: options.IS_PRODUCTION ? "production" : "development",
    entry: {
      editor: [
        "./editor/js/bootstraps/initConfig.js",
        "./editor/js/bootstraps/initBrizyGlobal.js",
        "./editor/js/bootstraps/editor/index.js"
      ]
    },
    output: {
      path: path.resolve(BUILD_PATH, `editor/js`),
      filename: "[name].js"
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
          test: /\.jsx?$/,
          include: [path.resolve(__dirname, "editor")],
          loader: "babel-loader",
          options: babelrc.editor()
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          options.IS_PRODUCTION ? "production" : "development"
        ),
        TARGET: JSON.stringify(options.TARGET),
        IS_EDITOR: true,
        IS_PREVIEW: false
      }),
      new WorkerPlugin({
        globalObject: false
      })
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: "editor.vendor"
          }
        }
      }
    },
    devtool: options.IS_PRODUCTION ? false : "cheap-module-eval-source-map",
    watch: !options.NO_WATCH && !options.IS_PRODUCTION,
    watchOptions: {
      ignored: new RegExp(`config/icons`)
    }
  };
};
