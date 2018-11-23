const path = require("path");
const editorConfigFn = require("./webpack.config.editor");

module.exports = options => {
  const editorConfig = editorConfigFn(options);

  return {
    mode: options.IS_PRODUCTION ? "production" : "development",
    entry: "./editor/js/bootstraps/preview/index.js",
    output: {
      ...editorConfig.output,
      filename: "preview.js"
    },
    devtool: editorConfig.devtool,
    watch: editorConfig.watch
  };
};
