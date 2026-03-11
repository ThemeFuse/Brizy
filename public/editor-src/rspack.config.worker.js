const path = require("path");
const rspackEditorConfigFn = require("./rspack.config.editor");

exports.screenshots = (options) => {
  const editorConfig = rspackEditorConfigFn(options);
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");

  return {
    name: "screenshots",
    mode: editorConfig.mode,
    entry: {
      screenshots: "./editor/js/bootstraps/workers/screenshots/index.js"
    },
    output: {
      path: path.resolve(BUILD_PATH, "editor/js"),
      filename: "[name].worker.min.js"
    },
    module: editorConfig.module,
    resolve: {
      extensions: editorConfig.resolve.extensions
    },
    plugins: [
      // currently we rely on DefinePlugin's index to be 0 in editorConfig
      editorConfig.plugins[0]
    ],
    devtool: editorConfig.devtool,
    watchOptions: editorConfig.watchOptions
  };
};
