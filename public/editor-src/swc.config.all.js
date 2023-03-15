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
      coreJs: "3"
    }
  };
};

exports.export = (options) => {
  const { module, sourceMap, jsc, env } = exports.editor(options);
  const clonedEnv = JSON.parse(JSON.stringify(env));
  const clonedJsc = JSON.parse(JSON.stringify(jsc));

  clonedEnv.targets = "node 12";

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

exports.preview = (options) => {
  const { module, sourceMap, jsc, env } = exports.editor(options);
  const clonedEnv = JSON.parse(JSON.stringify(env));
  const clonedJsc = JSON.parse(JSON.stringify(jsc));

  clonedEnv.targets.browsers = ["> 0.5%", "last 2 versions"];
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
