const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
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
  let externals = {
    react: "React",
    "react-dom": "ReactDOM"
  };

  if (target === "WP") {
    externals = { ...externals, jquery: "jQuery" };
  }

  return externals;
};

function getVendors(BUILD_MODE) {
  const pathToReact = path.resolve(
    path.dirname(require.resolve("react")),
    "umd"
  );
  const pathToReactDOM = path.resolve(
    path.dirname(require.resolve("react-dom")),
    "umd"
  );
  const reactFilename = fs
    .readdirSync(pathToReact)
    .find((file) => file.startsWith(`react.${BUILD_MODE}`));
  const reactDOMFilename = fs
    .readdirSync(pathToReactDOM)
    .find((file) => file.startsWith(`react-dom.${BUILD_MODE}`));

  const VENDORS = {
    react: path.resolve(pathToReact, reactFilename),
    "react-dom": path.resolve(pathToReactDOM, reactDOMFilename)
  };

  return Object.entries(VENDORS).map(([k, v]) => ({
    from: v,
    to: `${k}[ext]`
  }));
}

module.exports = (options = {}) => {
  // extracted variable to make phpstorm work with aliases
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");
  const BUILD_MODE = options.IS_PRODUCTION ? "production" : "development";

  return {
    mode: BUILD_MODE,
    entry: {
      polyfill: "./editor/js/bootstraps/polyfill.js",
      editor: [
        "./editor/js/bootstraps/initConfig/index.js",
        "./editor/js/bootstraps/editor/webpack-public-path.js",
        "./editor/js/bootstraps/initBrizyGlobal.ts",
        "./editor/js/bootstraps/registerEditorParts.ts",
        "./editor/js/bootstraps/editor/index.tsx"
      ]
    },
    output: {
      path: path.resolve(BUILD_PATH, "editor/js"),
      filename: "[name].min.js"
    },
    resolve: {
      alias: {
        visual: path.resolve(__dirname, "editor/js")
      },
      extensions: getExtensions(options.TARGET),
      fallback: {
        "process/browser": require.resolve("process/browser"),
        buffer: require.resolve("buffer")
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "../packages")
          ],
          use: { loader: "swc-loader", options: swcrc.editor(options) }
        }
      ]
    },
    plugins: [
      // NOTE: DefinePlugin's order (0) is important
      // because it is relied on in ./webpack.config.pro.js
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(BUILD_MODE),
        TARGET: JSON.stringify(options.TARGET),
        IS_EDITOR: true,
        IS_PREVIEW: false,
        AUTHORIZATION_URL: JSON.stringify(options.AUTHORIZATION_URL)
      }),
      new webpack.ProvidePlugin({
        process: "process/browser"
      }),
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      }),
      new CopyPlugin({
        patterns: getVendors(BUILD_MODE)
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
