const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const editorConfigFn = require("./webpack.config.editor");
const swcrc = require("./swc.config.all");

exports.node = (options) => {
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
      "./editor/js/bootstraps/compiler/node/index.js"
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
        COMPILER_TYPE: JSON.stringify("node"),
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

exports.browser = (options) => {
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
    /react-slick/,
    /@uiw/,
    /@brizy\/ui/,
    /@dnd-kit/,
    /rxjs/,

    // stripped for performance / bundle size reduction
    /\/editor\/js\/component\/Prompts\//,
    /\/editor\/js\/component\/Options\//,
    /\/editor\/js\/utils\/toolbar\//,
    /\/node_modules\/lottie-react\//,
    /\/node_modules\/jquery\//,
    /\/node_modules\/react-facebook\//
  ];

  const exceptionNullLoaderArr = [
    /\/editor\/js\/component\/Options\/utils\//,
    /\/editor\/js\/component\/Options\/Type/,
    /\/editor\/js\/component\/Options\/types\/utils\/makeValueToOptions/,

    // Used in preview
    /\/editor\/js\/component\/Options\/types\/dev\/Motion\//,
    /\/editor\/js\/component\/Options\/types\/dev\/Animation\//,
    /\/editor\/js\/component\/Options\/types\/dev\/Margin\//,
    /\/editor\/js\/component\/Options\/types\/dev\/ImageUpload\/converters/
  ];

  const config = {
    target: "webworker",
    mode: editorConfig.mode,
    entry: {
      compiler: "./editor/js/bootstraps/compiler/browser/index.ts"
    },
    output: {
      ...editorConfig.output,
      chunkFilename: "[name].[contenthash].min.js"
    },
    resolve: {
      ...editorConfig.resolve,
      fallback: {
        ...editorConfig.resolve.fallback,
        // Need for webpack 5 and sanitize-html package
        util: require.resolve("util"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        fs: false
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "../packages")
          ],
          loader: "swc-loader",
          options: swcrc.webworker(options)
        },
        {
          test(path) {
            const isExcluded = nullLoaderArr.some((r) => r.test(path));
            const isException = exceptionNullLoaderArr.some((r) =>
              r.test(path)
            );
            return isExcluded && !isException;
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
        COMPILER_TYPE: JSON.stringify("worker"),
        IS_EDITOR: false,
        IS_PREVIEW: true,
        window: "undefined"
      }),
      new webpack.ProvidePlugin({
        process: "process/browser"
      })
    ],
    optimization: {
      splitChunks: {
        chunks: "all",

        cacheGroups: {
          ui: {
            test: /[\\/]node_modules[\\/](@brizy\/builder-ui|antd)[\\/]/,
            priority: -10,
            filename: "compiler.ui.vendor.[contenthash].js",
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            filename: "compiler.vendor.[contenthash].js",
            priority: -20,
            reuseExistingChunk: true
          },
          utils: {
            test: /[\\/]utils[\\/]/,
            filename: "compiler.utils.vendor.[contenthash].js",
            reuseExistingChunk: true,
            priority: -30
          },
          json: {
            type: "json",
            filename: "compiler.json.vendor.[contenthash].js"
          }
        }
      }
    },
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
