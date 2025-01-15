const path = require("path");
const webpack = require("webpack");
const swcrc = require("./swc.config.all");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { omit } = require("timm");
const {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator
} = require("resolve-url-loader");

const rootPackage = require("./package.json");
const packageJSON = {
  ...omit(rootPackage, ["dependencies", "scripts"]),
  exports: {
    "./*.css": "./dist/css/*.css",
    "./preview": "./dist/preview.js",
    "./editor": "./dist/editor.js"
  },
  peerDependencies: {
    react: rootPackage.dependencies["react"],
    "react-dom": rootPackage.dependencies["react-dom"]
  }
};

const sassDirectory = path.resolve(__dirname, "editor/sass");

const fontsGenerator = asGenerator((item, ...rest) => {
  const defaultGenerator = defaultJoinGenerator(item, ...rest);

  if (item.bases.selector.includes("/node_modules/")) {
    return [...defaultGenerator];
  }

  return [
    ...defaultGenerator,
    path.resolve(sassDirectory, "editor", "fonts"),
    path.basename(item.uri)
  ];
});

const myJoinFn = createJoinFunction(
  "joinFnForFonts",
  createJoinImplementation(fontsGenerator)
);

const webpackConfig = (options) => {
  const BUILD_PATH = options.BUILD_PATH;
  const BUILD_MODE = options.IS_PRODUCTION ? "production" : "development";
  const distPath = path.resolve(BUILD_PATH, "dist");

  return {
    mode: BUILD_MODE,
    output: {
      path: distPath,
      filename: "[name].js",
      clean: true,
      publicPath: "",
      globalObject: "this",
      library: {
        name: packageJSON.name,
        type: "umd",
        umdNamedDefine: true
      }
    },
    resolve: {
      alias: {
        visual: path.resolve(__dirname, "editor/js")
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "../packages")
          ],
          use: {
            loader: "swc-loader",
            options: swcrc.module(options)
          }
        },

        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer", "tailwindcss"]
                }
              }
            },
            {
              loader: "resolve-url-loader",
              options: {
                join: myJoinFn
              }
            },
            "sass-loader"
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            publicPath: "fonts/",
            outputPath: "fonts"
          }
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          default: false
        }
      }
    },
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      new GenerateJsonPlugin("../package.json", packageJSON, (_, v) => v, 2),
      new MiniCssExtractPlugin({
        filename: "css/[name].css"
      }),
      ...(options.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
    ],
    devtool: options.IS_PRODUCTION ? false : "eval-cheap-module-source-map",
    watch: options.WATCH && !options.IS_PRODUCTION
  };
};

const webpackPreviewConfig = (options) => {
  const baseConfig = webpackConfig(options);
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
    /@brizy\/ui\//,
    /@brizy\/ui-icons\//,
    /@dnd-kit/,
    /rxjs/,
    /swiper/,

    // stripped for performance / bundle size reduction
    /\/editor\/js\/component\/Prompts\//,
    /\/editor\/js\/component\/Options\//,
    /\/editor\/js\/utils\/toolbar\//,
    /\/node_modules\/lottie-react\//,
    /\/node_modules\/lottie-web\//,
    /\/node_modules\/jquery\//,
    /\/node_modules\/react-facebook\//
  ];

  return {
    ...baseConfig,
    entry: {
      preview: "./editor/js/bootstraps/module/index.tsx",
      previewCSS: "./editor/sass/main.export.pro.scss"
    },
    module: {
      ...baseConfig.module,
      rules: [
        ...baseConfig.module.rules,
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
      ...baseConfig.plugins,
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(baseConfig.mode),
        TARGET: JSON.stringify(options.TARGET),
        IS_EDITOR: false,
        IS_PREVIEW: true
      })
    ]
  };
};

const webpackEditorConfig = (options) => {
  const baseConfig = webpackConfig(options);

  return {
    ...baseConfig,
    entry: {
      editor: [
        "./editor/js/bootstraps/initBrizyGlobal.ts",
        "./editor/js/bootstraps/module/index.tsx"
      ],
      editorCSS: "./editor/sass/main.editor.scss"
    },
    output: {
      ...baseConfig.output,
      clean: false
    },
    plugins: [
      ...baseConfig.plugins,
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(baseConfig.mode),
        TARGET: JSON.stringify(options.TARGET),
        IS_EDITOR: true,
        IS_PREVIEW: false
      })
    ]
  };
};

module.exports = (env, argv) => {
  const options = {
    TARGET: "Cloud",
    WATCH: argv.watch ?? false,
    IS_PRODUCTION: argv.mode === "production",
    BUILD_PATH: env["build-dir"] ?? path.resolve(__dirname, "build"),
    ANALYZE: argv.analyze ?? false
  };
  const previewConfig = webpackPreviewConfig(options);
  const editorConfig = webpackEditorConfig(options);

  return [previewConfig, editorConfig];
};
