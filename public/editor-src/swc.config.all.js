const coreJSVersion = "3.41";

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
  const { sourceMap, jsc, env } = exports.editor(options);
  const clonedEnv = JSON.parse(JSON.stringify(env));
  const clonedJsc = JSON.parse(JSON.stringify(jsc));

  clonedEnv.targets = "node 20";

  clonedJsc.minify = {
    ...clonedJsc.minify,
    // removed all comments & console
    compress: options.IS_PRODUCTION ? { drop_console: true } : false
  };

  return {
    module: {
      type: "commonjs"
    },
    sourceMap,
    jsc: clonedJsc,
    env: clonedEnv
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

exports.preview = (options) => {
  const { module, sourceMap, jsc, env } = exports.editor(options);
  const clonedEnv = JSON.parse(JSON.stringify(env));
  const clonedJsc = JSON.parse(JSON.stringify(jsc));

  clonedEnv.targets.browsers = [
    "> 0.5%",
    "last 2 versions",
    "not dead",
    "fully supports es6-module"
  ];

  clonedJsc.transform = {
    optimizer: {
      simplify: true
    }
  };

  clonedJsc.minify = options.IS_PRODUCTION ? {
    compress: {
      drop_console: true
    }
  } : undefined;

  return {
    module: {
      ...module,
      strict: true,
      strictMode: true
    },
    sourceMap,
    jsc: clonedJsc,
    env: clonedEnv,
    isModule: true,
    minify: false 
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
