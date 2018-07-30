const path = require("path");
const webpack = require("webpack");
const { extend } = require("underscore");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const TARGET = process.env.TARGET || "local";
const excludeFolders = /(\/|\\)node_modules(\/|\\)/;

// target specific settings
const getExtensions = target => {
  const defaultExtensions = [".js", ".jsx", ".json"];

  switch (target) {
    case "WP":
      return [".wp.js", ".wp.jsx", ...defaultExtensions];
    default:
      return defaultExtensions;
  }
};

var commonRules = [
  {
    test: /\.jsx?$/,
    use: "babel-loader",
    // include: __dirname,
    exclude: excludeFolders
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: "file-loader",
        options: {
          outputPath: "icons/",
          name: "[hash].[ext]"
        }
      }
    ],
    // include: __dirname,
    exclude: excludeFolders
  }
];
const editorRules = [
  {
    test: /Preview\.jpg$/,
    use: "null-loader",
    // include: __dirname,
    exclude: excludeFolders
  }
];
const staticRules = [
  {
    test: /quill|Preview\.jpg/,
    use: "null-loader"
  }
];

const makeEditorConfig = function(options) {
  const devtool = options.IS_PRODUCTION
    ? "source-map"
    : "cheap-module-eval-source-map";

  return {
    entry: {
      editor: [
        "./editor/js/bootstraps/editor/configInit.js",
        "./editor/js/bootstraps/editor/index.js"
      ],
      vendor: [
        "classnames",
        "deep-extend",
        "events",
        "glamor",
        "nanoid",
        "quill",
        "rc-slider",
        "react",
        "react-dom",
        "react-list",
        "react-redux",
        "react-resize-aware",
        "react-slick",
        "react-sortable-hoc",
        "react-transition-group",
        "redux",
        "redux-thunk",
        "timm",
        "tinycolor2",
        "underscore"
      ]
    },
    output: {
      path: path.resolve(options.BUILD_PATH, "editor/js"),
      publicPath: "visual/",
      filename: "[name].js"
    },
    resolve: {
      alias: {
        visual: path.resolve(__dirname, "editor/js"),
        "visual-template": options.TEMPLATE_PATH
      },
      extensions: getExtensions(options.TARGET)
    },
    externals: {
      jquery: "jQuery"
    },
    node: {
      crypto: "empty"
    },
    module: {
      rules: [...commonRules, ...editorRules]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          options.IS_PRODUCTION ? "production" : "development"
        ),
        TARGET: JSON.stringify(TARGET),
        IS_EDITOR: true,
        IS_PREVIEW: false
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "editor.vendor.bundle.js",
        minChunks: Infinity
      }),
      ...(options.IS_PRODUCTION
        ? [
            new UglifyJSPlugin({
              sourceMap: true
            })
          ]
        : [])
    ],
    devtool: devtool,
    watch: true,
    watchOptions: {
      ignored: new RegExp(`templates/${options.TEMPLATE_NAME}`)
    }
  };
};

const makeExportConfig = function(options) {
  var editorConfig = makeEditorConfig(options);
  return extend({}, editorConfig, {
    target: "node",
    entry: {
      export: [
        "./editor/js/bootstraps/export/configInit.js",
        "./editor/js/bootstraps/export/index.js"
      ]
    },
    output: {
      ...editorConfig.output,
      libraryTarget: "commonjs2"
    },
    externals: {},
    module: {
      rules: [...commonRules, ...staticRules]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          options.IS_PRODUCTION ? "production" : "development"
        ),
        TARGET: JSON.stringify(TARGET),
        IS_EDITOR: false,
        IS_PREVIEW: true
      })
    ],
    devtool: false
  });
};

module.exports = {
  makeForGulp: function(options) {
    const configs = [makeEditorConfig(options)];

    if (options.IS_EXPORT) {
      process.env.BABEL_ENV = "export";
      configs.push(makeExportConfig(options));
    }

    if (options.IS_PRODUCTION || options.NO_WATCH) {
      configs.forEach(config => (config.watch = false));
    }

    return configs;
  }
};
