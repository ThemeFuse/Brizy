const path = require("path");
const rspack = require("@rspack/core");
const { RsdoctorRspackPlugin } = require("@rsdoctor/rspack-plugin");
const editorConfigFn = require("./rspack.config.editor");
const swcrc = require("./swc.config.all");

const defaultExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

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

const getExtensions = (target) => {
  switch (target) {
    case "WP": {
      return [
        ".preview.wp.ts",
        ".preview.wp.tsx",
        ".preview.wp.js",
        ".preview.wp.jsx",
        ".preview.ts",
        ".preview.tsx",
        ".preview.js",
        ".preview.jsx",
        ".wp.ts",
        ".wp.tsx",
        ".wp.js",
        ".wp.jsx",
        ...defaultExtensions
      ];
    }
    default: {
      return [
        ".preview.ts",
        ".preview.tsx",
        ".preview.js",
        ".preview.jsx",
        ...defaultExtensions
      ];
    }
  }
};

exports.node = (options) => {
  const editorConfig = editorConfigFn(options);
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");

  const config = {
    name: "export.node",
    mode: "none",
    target: "node",
    entry: "./editor/js/bootstraps/compiler/node/index.ts",
    output: {
      path: path.resolve(BUILD_PATH, "editor/js"),
      filename: "export.js",
      library: {
        type: "module"
      },
      module: true,
      chunkFormat: "module",
      chunkLoading: "import"
    },
    experiments: {
      outputModule: true
    },
    resolve: {
      ...editorConfig.resolve,
      alias: {
        ...editorConfig.resolve.alias,
        react: require.resolve("react"),
        "react-dom": require.resolve("react-dom")
      },
      extensions: getExtensions(options.TARGET)
    },
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
          test: /\.(s[ac]ss|css)$/i,
          include: [
            path.resolve(__dirname, "editor/sass"),
            path.resolve(__dirname, "../packages")
          ],
          use: [
            {
              loader: path.resolve(
                __dirname,
                "build-utils/scss-tracker-loader.js"
              ),
              options: {
                trackImports: true,
                isPro: false
              }
            },
            "null-loader" // SCSS files are tracked but not actually compiled in Node compiler
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            emit: false // Don't emit font files in node build
          }
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
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          options.IS_PRODUCTION ? "production" : "development"
        ),
        TARGET: JSON.stringify(options.TARGET),
        COMPILER_TYPE: JSON.stringify("node"),
        window: "undefined"
      }),
      new rspack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      ...(options.ANALYZE
        ? [
            new RsdoctorRspackPlugin({
              name: "export.node",
              port: 9991,
              // Need when we check bunde size on CI CD
              ...(options.CHECK_BUNDLE_SIZE && {
                disableClientServer: true,
                output: {
                  mode: "brief",
                  options: {
                    type: ["json"],
                    optimizationBailout: true,
                    jsonOptions: {
                      fileName: "nodeCompiler-bundle-stats.json"
                    }
                  }
                }
              })
            })
          ]
        : [])
    ],
    optimization: {
      minimize: options.IS_PRODUCTION,
      usedExports: true,
      concatenateModules: true,
      runtimeChunk: false,
      splitChunks: false,
      minimizer: [
        new rspack.SwcJsMinimizerRspackPlugin({
          minimizerOptions: {
            compress: {
              passes: 2
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    },
    devtool: false,
    watchOptions: editorConfig.watchOptions,
    performance: {
      hints: false
    }
  };

  return config;
};

exports.browser = (options) => {
  const editorConfig = editorConfigFn(options);
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");

  const config = {
    name: "export.browser",
    target: "webworker",
    mode: editorConfig.mode,
    entry: {
      compiler: "./editor/js/bootstraps/compiler/browser/index.ts"
    },
    output: {
      path: path.resolve(BUILD_PATH, "editor/js"),
      filename: "[name].min.js",
      chunkFilename: "[name].[contenthash].min.js"
    },
    resolve: {
      ...editorConfig.resolve,
      alias: {
        ...editorConfig.resolve.alias,
        react: require.resolve("react"),
        "react-dom": require.resolve("react-dom")
      },
      extensions: getExtensions(options.TARGET),
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
          test: /\.(s[ac]ss|css)$/i,
          include: [
            path.resolve(__dirname, "editor/sass"),
            path.resolve(__dirname, "../packages")
          ],
          use: [
            {
              loader: path.resolve(
                __dirname,
                "build-utils/scss-tracker-loader.js"
              ),
              options: {
                trackImports: true,
                isPro: false
              }
            },
            "null-loader"
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            emit: false
          }
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
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          options.IS_PRODUCTION ? "production" : "development"
        ),
        TARGET: JSON.stringify(options.TARGET),
        COMPILER_TYPE: JSON.stringify("worker"),
        window: "undefined"
      }),
      new rspack.ProvidePlugin({
        process: "process/browser"
      }),
      ...(options.ANALYZE
        ? [
            new RsdoctorRspackPlugin({
              name: "export.browser",
              port: 9992,
              // Need when we check bunde size on CI CD
              ...(options.CHECK_BUNDLE_SIZE && {
                disableClientServer: true,
                output: {
                  mode: "brief",
                  options: {
                    type: ["json"],
                    optimizationBailout: true,
                    jsonOptions: {
                      fileName: "browserCompiler-bundle-stats.json"
                    }
                  }
                }
              })
            })
          ]
        : [])
    ],
    optimization: {
      minimize: options.IS_PRODUCTION,
      usedExports: true,
      providedExports: true,
      concatenateModules: true,
      sideEffects: true,
      minimizer: [
        new rspack.SwcJsMinimizerRspackPlugin({
          minimizerOptions: {
            compress: {
              drop_console: true,
              passes: 2,
              dead_code: true
            },
            mangle: options.IS_PRODUCTION,
            format: {
              comments: false
            }
          }
        })
      ],
      splitChunks: {
        chunks: "all",
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          // Group all CSS registration chunks (tiny chunks with SCSS tracker code) into one
          cssRegistrations: {
            test(module) {
              // Check if this module is a CSS tracker registration (from scss-tracker-loader)
              const request = module.request || "";
              return (
                request.includes(".scss?componentId=") ||
                request.includes(".scss?chunk=") ||
                request.includes(".css?componentId=") ||
                request.includes(".css?chunk=")
              );
            },
            name: "compiler-css-registrations",
            chunks: "async",
            priority: 10,
            enforce: true,
            reuseExistingChunk: true
          },
          ui: {
            test: /[\\/]node_modules[\\/](@brizy\/builder-ui|antd)[\\/]/,
            priority: -10,
            filename: "compiler.ui.vendor.[contenthash].js",
            reuseExistingChunk: true,
            minSize: 20000
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            filename: "compiler.vendor.[contenthash].js",
            priority: -20,
            reuseExistingChunk: true,
            minSize: 20000
          },
          utils: {
            test: /[\\/]utils[\\/]/,
            filename: "compiler.utils.vendor.[contenthash].js",
            reuseExistingChunk: true,
            priority: -30,
            minSize: 20000
          },
          json: {
            type: "json",
            filename: "compiler.json.vendor.[contenthash].js",
            minSize: 20000
          }
        }
      }
    },
    devtool: editorConfig.devtool,
    watchOptions: editorConfig.watchOptions,
    performance: {
      hints: false
    }
  };

  return config;
};

exports.nullLoaderArr = nullLoaderArr;
