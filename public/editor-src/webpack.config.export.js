const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const editorConfigFn = require("./webpack.config.editor");
const swcrc = require("./swc.config.all");

module.exports = (options) => {
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
    /react-calendly/,

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
    mode: "none",
    target: "node",
    entry: [
      "./editor/js/bootstraps/initConfig/index.js",
      "./editor/js/bootstraps/initBrizyGlobal.js",
      "./editor/js/bootstraps/registerEditorParts.ts",
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
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "../packages")
          ],
          use: { loader: "swc-loader", options: swcrc.export(options) }
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
      }),
      new webpack.NormalModuleReplacementPlugin(
        /visual\/component\/Toolbar/,
        (r) => {
          switch (r.request) {
            case "visual/component/Toolbar/state":
              r.request = "visual/component/ToolbarMock/state.ts";
              break;
            default:
              r.request = "visual/component/ToolbarMock/Toolbar.ts";
          }

          return r;
        }
      )
    ],
    devtool: false,
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
