const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const editorConfigFn = require("./webpack.config.editor");
const swcrc = require("./swc.config.all");
const LibsConfig = require("./editor/js/bootstraps/libs.json");

exports.preview = (options) => {
  const editorConfig = editorConfigFn(options);
  const config = {
    mode: editorConfig.mode,
    entry: "./editor/js/bootstraps/preview/index.js",
    output: {
      ...editorConfig.output,
      filename: "preview.js"
    },
    resolve: {
      alias: {
        "visual/libs": path.resolve(__dirname, "editor/js/libs"),
        "visual/utils": path.resolve(__dirname, "editor/js/utils"),
        "visual/global": path.resolve(__dirname, "editor/js/global")
      },
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
    externals: {
      jquery: "jQuery"
    },
    performance: {
      hints: false
    },
    devtool: editorConfig.devtool,
    watch: editorConfig.watch
  };

  const configAnalyze = {
    mode: "production",
    plugins: [new BundleAnalyzerPlugin()],
    watch: false
  };

  return options.ANALYZE ? { ...config, ...configAnalyze } : config;
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
      filename: "[name].js",
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
