const coreJSVersion = "3.41";

exports.editor = (options) => {
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
  const { module, sourceMap, jsc, env } = exports.editor(options);
  const clonedEnv = JSON.parse(JSON.stringify(env));
  const clonedJsc = JSON.parse(JSON.stringify(jsc));

  clonedEnv.targets = "node 20";

  clonedJsc.minify = {
    ...clonedJsc.minify,
    // removed all comments & console
    compress: options.IS_PRODUCTION ? { drop_console: true } : false
  };

  return {
    module,
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

exports.preview = (options) => {
  const { module, sourceMap, jsc, env } = exports.editor(options);
  const clonedEnv = JSON.parse(JSON.stringify(env));
  const clonedJsc = JSON.parse(JSON.stringify(jsc));

  clonedEnv.targets.browsers = ["> 0.5%", "last 2 versions"];

  return {
    module,
    sourceMap,
    jsc: clonedJsc,
    env: clonedEnv
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
