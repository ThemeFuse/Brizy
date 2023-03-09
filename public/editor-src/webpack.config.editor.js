const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const swcrc = require("./swc.config.all");

const getExtensions = (target) => {
  const defaultExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

  switch (target) {
    case "WP":
      return [".wp.ts", ".wp.tsx", ".wp.js", ".wp.jsx", ...defaultExtensions];
    default:
      return defaultExtensions;
  }
};

const getExternal = (target) => {
  if (target === "WP") {
    return { jquery: "jQuery" };
  }

  return {};
};

module.exports = (options = {}) => {
  // extracted variable to make phpstorm work with aliases
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");

  return {
    mode: options.IS_PRODUCTION ? "production" : "development",
    entry: {
      polyfill: "./editor/js/bootstraps/polyfill.js",
      editor: [
        "./editor/js/bootstraps/initConfig/index.js",
        "./editor/js/bootstraps/editor/webpack-public-path.js",
        "./editor/js/bootstraps/initBrizyGlobal.js",
        "./editor/js/bootstraps/editor/index.js"
      ]
    },
    output: {
      path: path.resolve(BUILD_PATH, "editor/js"),
      filename: "[name].js"
    },
    resolve: {
      alias: {
        visual: path.resolve(__dirname, "editor/js"),
        ui: path.resolve(__dirname, "packages/ui/src"),
        core: path.resolve(__dirname, "packages/core/src"),
        component: path.resolve(__dirname, "packages/component/src"),
        widget: path.resolve(__dirname, "packages/widget/src"),
        widgetTemp: path.resolve(__dirname, "packages/widgetTemp/src")
      },
      extensions: getExtensions(options.TARGET)
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "packages")
          ],
          loader: "swc-loader",
          options: swcrc.editor(options)
        },

        // It's only for CodeMirror
        {
          test: /\.(html|css)$/,
          include: [path.resolve(__dirname, "node_modules/codemirror")],
          loader: "null-loader"
        }
      ]
    },
    plugins: [
      // NOTE: DefinePlugin's order (0) is important
      // because it is relied on in ./webpack.config.pro.js
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          options.IS_PRODUCTION ? "production" : "development"
        ),
        TARGET: JSON.stringify(options.TARGET),
        IS_EDITOR: true,
        IS_PREVIEW: false,
        IS_EXPORT: JSON.stringify(options.IS_EXPORT),
        AUTHORIZATION_URL: JSON.stringify(options.AUTHORIZATION_URL)
      }),
      new webpack.ProvidePlugin({
        process: "process/browser"
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
    externals: getExternal(options.TARGET),
    devtool: options.IS_PRODUCTION ? false : "eval-cheap-module-source-map",
    watch: !options.NO_WATCH && !options.IS_PRODUCTION,
    watchOptions: {
      ignored: new RegExp("config/icons")
    }
  };
};
