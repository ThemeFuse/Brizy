if (process.env.NODE_ENV !== "test") {
  // this config is made specifically for Jest at the moment
  return;
}

module.exports = api => {
  api.cache(true);

  const presets = ["@babel/preset-typescript"];
  const plugins = [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ];

  return {
    presets,
    plugins
  };
};
