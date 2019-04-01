const path = require("path");
const editorConfigFn = require("./webpack.config.editor");
const babelrc = require("./babelrc.config.all");

module.exports = options => {
  const editorConfig = editorConfigFn(options);

  return {
    mode: options.IS_PRODUCTION ? "production" : "development",
    entry: "./editor/js/bootstraps/preview/index.js",
    output: {
      ...editorConfig.output,
      filename: "preview.js"
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          include: [path.resolve(__dirname, "editor")],
          loader: "babel-loader",
          options: babelrc.preview()
        }
      ]
    },
    devtool: editorConfig.devtool,
    watch: editorConfig.watch
  };
};
