const coreJSVersion = "3.41";

const previewBrowserlist = [
  "> 0.5%",
  "last 2 versions",
  "not dead",
  "fully supports es6-module",
  "not op_mini all", // Exclude Opera Mini - too limited for modern features
  "not kaios <= 3", // Exclude KaiOS - feature phone platform with limited support
  "not edge < 79", // Exclude old non-Chromium Edge (modern Edge is 79+)
  "not chrome < 90", // Exclude Chrome older than 90 (2021+)
  "not opera < 76", // Exclude Opera older than 76 (2021+)
  "not safari < 14", // Exclude Safari older than 14 (2020+)
  "not ios_saf < 14", // Exclude iOS Safari older than 14 (2020+)(IntersectionObserver)
  "not firefox < 88" // Exclude Firefox older than 88 (2021+)
];

exports.editor = (options) => {
  return {
    module: {
      type: "es6"
    },
    sourceMap: !options.IS_PRODUCTION,
    minify: options.IS_PRODUCTION,
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: true
      }
    },
    env: {
      targets: {
        browsers: [
          "last 2 chrome versions",
          "last 2 firefox versions",
          "last 2 safari versions",
          "last 2 edge versions"
        ]
      },
      mode: "usage",
      coreJs: coreJSVersion
    }
  };
};

exports.export = (options) => {
  return {
    module: {
      type: "commonjs"
    },
    sourceMap: !options.IS_PRODUCTION,
    minify: options.IS_PRODUCTION,
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: true
      },
      experimental: {
        // Enable Loadable for SSR and webworker to render component not fallback
        cacheRoot: "node_modules/.cache/.swc",
        plugins: [["@swc/plugin-loadable-components", {}]]
      }
    },
    env: {
      targets: "node 24",
      mode: "usage",
      coreJs: coreJSVersion
    }
  };
};

exports.webworker = (options) => {
  return {
    module: {
      type: "es6"
    },
    sourceMap: !options.IS_PRODUCTION,
    minify: options.IS_PRODUCTION,
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: true,
        dynamicImport: true
      },
      experimental: {
        // Enable Loadable for SSR and webworker to render component not fallback
        cacheRoot: "node_modules/.cache/.swc",
        plugins: [["@swc/plugin-loadable-components", {}]]
      }
    },
    env: {
      targets: {
        browsers: [
          "last 2 chrome versions",
          "last 2 firefox versions",
          "last 2 safari versions",
          "last 2 edge versions"
        ]
      },
      mode: "usage",
      coreJs: coreJSVersion
    }
  };
};

exports.previewBrowserlist = previewBrowserlist;

exports.preview = (options) => {
  return {
    isModule: true,
    minify: false,
    module: {
      type: "es6",
      strict: true,
      strictMode: true
    },
    sourceMap: !options.IS_PRODUCTION,
    jsc: {
      transform: {
        optimizer: {
          simplify: true
        }
      },
      parser: {
        syntax: "typescript"
      },
      ...(options.IS_PRODUCTION
        ? {
            minify: {
              compress: {
                drop_console: true
              }
            }
          }
        : undefined)
    },
    env: {
      targets: {
        browsers: previewBrowserlist
      }
    }
  };
};

exports.module = (options) => {
  return {
    module: {
      type: "es6"
    },
    sourceMap: !options.IS_PRODUCTION,
    minify: options.IS_PRODUCTION,
    jsc: {
      target: "es2021",
      parser: {
        syntax: "typescript",
        tsx: true
      },
      transform: {
        react: {
          runtime: "automatic"
        }
      }
    }
  };
};
