const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const editorConfigFn = require("./webpack.config.editor");
const babelrc = require("./babelrc.config.all");
const LibsConfig = require("./editor/js/bootstraps/libs.json");

exports.preview = options => {
  const editorConfig = editorConfigFn(options);

  return {
    mode: editorConfig.mode,
    entry: "./editor/js/bootstraps/preview/index.js",
    output: {
      ...editorConfig.output,
      filename: "preview.js"
    },
    resolve: {
      alias: {
        "visual/libs": path.resolve(__dirname, "editor/js/libs"),
        "visual/utils": path.resolve(__dirname, "editor/js/utils")
      },
      extensions: editorConfig.resolve.extensions
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          include: [path.resolve(__dirname, "editor")],
          loader: "babel-loader",
          options: babelrc.preview()
        }
      ]
    },
    externals: {
      jquery: "jQuery"
    },
    devtool: editorConfig.devtool,
    watch: editorConfig.watch
  };
};

exports.libs = options => {
  const editorConfig = editorConfigFn(options);
  const { free } = LibsConfig;
  const entry = free.reduce((acc, curr) => {
    const { name, path } = curr;
    return { ...acc, [name]: path };
  }, {});

  return {
    entry: entry,
    output: {
      path: path.resolve(options.BUILD_PATH, "editor/js"),
      filename: "[name].js",
      library: "BrizyLibs",
      libraryTarget: "window"
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
    devtool: editorConfig.devtool,
    watch: editorConfig.watch
  };
};
