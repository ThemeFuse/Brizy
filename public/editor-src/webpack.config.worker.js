const editorConfigFn = require("./webpack.config.editor");

exports.screenshots = (options) => {
  const editorConfig = editorConfigFn(options);

  return {
    mode: editorConfig.mode,
    entry: {
      screenshots: "./editor/js/bootstraps/workers/screenshots/index.js"
    },
    output: {
      path: editorConfig.output.path,
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
    watch: editorConfig.watch,
    watchOptions: editorConfig.watchOptions
  };
};
