const path = require("path");
const webpack = require("webpack");
const editorConfigFn = require("./webpack.config.editor");
const babelrc = require("./babelrc.config.all");

module.exports = options => {
  const editorConfig = editorConfigFn(options);

  return {
    mode: "none",
    target: "node",
    entry: [
      "./editor/js/bootstraps/initConfig.js",
      "./editor/js/bootstraps/initBrizyGlobal.js",
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
          test: /\.(ts|js)x?$/,
          include: [path.resolve(__dirname, "editor")],
          loader: "babel-loader",
          options: babelrc.export()
        },
        {
          test: /quill|isotope-layout|magnific-popup|slick-carousel/,
          loader: "null-loader"
        },
        {
          test: /[\\/]lib[\\/]/,
          include: [path.resolve(__dirname, "editor")],
          loader: "null-loader"
        },
        {
          test: /[\\/]Options[\\/]/,
          include: [path.resolve(__dirname, "editor")],
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
        IS_PREVIEW: true,
        window: "undefined"
      })
    ],
    devtool: false,
    watch: editorConfig.watch,
    watchOptions: editorConfig.watchOptions
  };
};
