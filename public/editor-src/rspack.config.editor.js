const path = require("path");
const rspack = require("@rspack/core");
const fs = require("fs");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const swcrc = require("./swc.config.all");

const getExtensions = (target) => {
  const defaultExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

  switch (target) {
    case "WP":
      return [".wp.ts", ".wp.tsx", ".wp.js", ".wp.jsx", ...defaultExtensions];
    default:
      return defaultExtensions;
  }
};

const getExternal = (target) => {
  let externals = {
    react: "React",
    "react-dom": "ReactDOM"
  };

  if (target === "WP") {
    externals = { ...externals, jquery: "jQuery" };
  }

  return externals;
};

function getVendors(BUILD_MODE) {
  const pathToReact = path.resolve(
    path.dirname(require.resolve("react")),
    "umd"
  );
  const pathToReactDOM = path.resolve(
    path.dirname(require.resolve("react-dom")),
    "umd"
  );
  const reactFilename = fs
    .readdirSync(pathToReact)
    .find((file) => file.startsWith(`react.${BUILD_MODE}`));
  const reactDOMFilename = fs
    .readdirSync(pathToReactDOM)
    .find((file) => file.startsWith(`react-dom.${BUILD_MODE}`));

  const VENDORS = {
    react: path.resolve(pathToReact, reactFilename),
    "react-dom": path.resolve(pathToReactDOM, reactDOMFilename)
  };

  return Object.entries(VENDORS).map(([k, v]) => ({
    from: v,
    to: `js/${k}[ext]`
  }));
}

module.exports = (options = {}) => {
  // extracted variable to make phpstorm work with aliases
  const BUILD_PATH = options.BUILD_PATH || path.resolve(__dirname, "build");
  const BUILD_MODE = options.IS_PRODUCTION ? "production" : "development";

  return {
    name: "editor",
    mode: BUILD_MODE,
    entry: {
      editor: [
        "./editor/js/bootstraps/initBrizyGlobal.ts",
        "./editor/js/bootstraps/editor/index.tsx"
      ]
    },
    output: {
      path: path.resolve(BUILD_PATH, "editor"),
      filename: "js/[name].min.js",
      chunkFilename: "js/[name].[contenthash:8].min.js",
      assetModuleFilename: "fonts/[name][ext]",
      uniqueName: "brizy-editor"
    },
    resolve: {
      alias: {
        visual: path.resolve(__dirname, "editor/js"),
        sass: path.resolve(__dirname, "editor/sass")
      },
      extensions: getExtensions(options.TARGET),
      fallback: {
        "process/browser": require.resolve("process/browser"),
        buffer: require.resolve("buffer")
      }
    },
    module: {
      rules: [
        {
          test: /\.(s[ac]ss|css)$/i,
          include: [
            path.resolve(__dirname, "../packages"),
            path.resolve(__dirname, "editor/sass"),
            path.resolve(__dirname, "editor/js")
          ],
          use: [
            { loader: rspack.CssExtractRspackPlugin.loader },
            { loader: "css-loader" },
            { loader: "resolve-url-loader" },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true, // <-- !!IMPORTANT used by "resolve-url-loader" to create url for every assets correctly
                postcssOptions: {
                  plugins: {
                    autoprefixer: {
                      overrideBrowserslist: ["last 2 versions"]
                    }
                  }
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true // <-- !!IMPORTANT used by "resolve-url-loader" to create url for every assets correctly
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource"
        },
        {
          test: /\.(ts|js)x?$/,
          include: [
            path.resolve(__dirname, "editor"),
            path.resolve(__dirname, "../packages")
          ],
          use: {
            loader: "swc-loader",
            options: swcrc.editor(options)
          }
        }
      ]
    },
    plugins: [
      // NOTE: DefinePlugin's order (0) is important
      // because it is relied on in ./rspack.config.pro.js
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(BUILD_MODE),
        TARGET: JSON.stringify(options.TARGET),
        AUTHORIZATION_URL: JSON.stringify(options.AUTHORIZATION_URL),
        BUILD_VERSION: JSON.stringify(options.BUILD_VERSION)
      }),
      new rspack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"]
      }),
      new rspack.CopyRspackPlugin({
        patterns: getVendors(BUILD_MODE)
      }),
      ...(options.ANALYZE ? [new BundleAnalyzerPlugin()] : []),
      new rspack.CssExtractRspackPlugin({
        filename: "css/[name].min.css",
        chunkFilename: "css/[name].min.css",
        // Disable dynamic injection for CSS files that are manually included in HTML
        // main.editor.min.css and main.base.min.css are already in editor.html.twig
        insert: function (linkTag) {
          const href = linkTag.getAttribute("href") ?? "";

          // Skip injection if this is one of the manually included CSS files
          if (
            href.includes("main.editor.min.css") ||
            href.includes("main.base.min.css")
          ) {
            return; // Don't inject - already in HTML
          }

          // For all other CSS files (code-split chunks, etc.), inject normally
          document.head.appendChild(linkTag);
        }
      })
    ],
    optimization: {
      minimize: options.IS_PRODUCTION,
      usedExports: true,
      removeEmptyChunks: true, // Remove chunks that are empty
      minimizer: [
        new rspack.LightningCssMinimizerRspackPlugin({
          minimizerOptions: {
            targets: ["last 2 versions"],
            minify: true,
            drafts: {
              customMedia: true
            },
            exclude: {
              logicalProperties: true
            }
          }
        }),
        new rspack.SwcJsMinimizerRspackPlugin({
          minimizerOptions: {
            compress: {
              passes: 2
            },
            format: {
              comments: false
            }
          }
        })
      ],
      splitChunks: {
        chunks: "all",
        minSize: 20000, // Minimum size in bytes for a chunk to be generated (20KB)
        minChunks: 1, // Minimum number of chunks that must share a module before splitting
        maxAsyncRequests: 30, // Maximum number of parallel requests for on-demand loading
        maxInitialRequests: 30, // Maximum number of parallel requests at entry point
        enforceSizeThreshold: 50000, // Size threshold at which splitting is enforced (50KB)
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
            name: "css-registrations",
            chunks: "async", // Only async chunks (dynamic imports)
            priority: 10, // Higher priority than other cache groups
            enforce: true,
            reuseExistingChunk: true
          },
          styles: {
            name(module) {
              // Extract chunk name from ?chunk=name query parameter in the module identifier
              const moduleId = module.identifier();

              if (moduleId) {
                const chunkName = moduleId.match(/\??chunk=([^&|]+)/)?.[1];

                if (chunkName) {
                  return chunkName;
                }
              }

              return undefined;
            },
            test: /\.(s[ac]ss|css)$/i,
            chunks: "all",
            enforce: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: "editor.vendor",
            minSize: 20000 // Also enforce minimum size for vendor chunks
          },
          default: {
            minChunks: 2, // Only create default chunks if used in at least 2 places
            priority: -20,
            reuseExistingChunk: true,
            minSize: 20000
          }
        }
      }
    },
    externals: getExternal(options.TARGET),
    devtool: options.IS_PRODUCTION ? false : "eval-cheap-module-source-map",
    watchOptions: {
      ignored: new RegExp("config/icons")
    },
    performance: {
      hints: false // Disable performance warnings for large bundles
    }
  };
};
