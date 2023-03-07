const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const swcrc = require("./swc.config.all");
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
      filename: "[name].worker.js"
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

exports.ssr = (options) => {
  const editorConfig = editorConfigFn(options);
  const nullLoaderArr = [
    // stripped because of errors when run in a node environment
    /graphql/,
    /apollo/,
    /@apollo\/client/,
    /quill/,
    /isotope-layout/,
    /magnific-popup/,
    /slick-carousel/,

    // stripped for performance / bundle size reduction
    /\/editor\/js\/component\/Prompts\//,
    // Need review this case because some element import fromElementModel | toElementModel
    // and uses it on compile
    // /\/editor\/js\/component\/Options\//,
    /\/editor\/js\/utils\/toolbar\//,
    /\/node_modules\/lottie-react\//,
    /\/node_modules\/jquery\//,
    /\/node_modules\/react-facebook\//
  ];

  const config = {
    target: "webworker",
    mode: editorConfig.mode,
    entry: "./editor/js/bootstraps/workers/ssr/index.ts",
    output: {
      ...editorConfig.output,
      filename: "ssr.worker.js"
    },
    resolve: editorConfig.resolve,
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
        {
          test(path) {
            return nullLoaderArr.some((r) => r.test(path));
          },
          loader: "null-loader"
        },
        {
          test: /[\\/](lib|screenshot)s?[\\/]/,
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
    devtool: editorConfig.devtool,
    watch: editorConfig.watch,
    watchOptions: editorConfig.watchOptions
  };

  const configAnalyze = {
    mode: "production",
    plugins: [...config.plugins, new BundleAnalyzerPlugin()],
    watch: false
  };

  return options.ANALYZE ? { ...config, ...configAnalyze } : config;
};
