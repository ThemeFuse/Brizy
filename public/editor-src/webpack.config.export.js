const path = require("path");
const webpack = require("webpack");
const editorConfigFn = require("./webpack.config.editor");

module.exports = options => {
  const editorConfig = editorConfigFn(options);

  return {
    mode: "none",
    target: "node",
    entry: [
      "./editor/js/bootstraps/export/configInit.js",
      "./editor/js/bootstraps/export/index.js"
    ],
    output: {
      ...editorConfig.output,
      filename: "export.js",
      libraryTarget: "commonjs2"
    },
    resolve: editorConfig.resolve,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [path.resolve(__dirname, "editor")],
          loader: "babel-loader",
          options: {
            plugins: ["transform-remove-console"]
          }
        },
        {
          test: /Preview\.jpg$/,
          include: [path.resolve(__dirname, "templates")],
          loader: "null-loader"
        },
        {
          test: /quill/,
          loader: "null-loader"
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          options.IS_PRODUCTION ? "production" : "development"
        ),
        TARGET: JSON.stringify(options.TARGET),
        IS_EDITOR: false,
        IS_PREVIEW: true
      })
    ],
    devtool: false,
    watch: editorConfig.watch,
    watchOptions: editorConfig.watchOptions
  };
};
