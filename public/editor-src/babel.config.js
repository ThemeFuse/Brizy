if (process.env.NODE_ENV !== "test") {
  // this config is made specifically for Jest at the moment
  return;
}

module.exports = api => {
  api.cache(true);

  const presets = [
    // [
    //   "@babel/preset-env",
    //   {
    //     targets: {
    //       browsers: [
    //         "last 2 chrome versions",
    //         "last 2 firefox versions",
    //         "last 2 safari versions",
    //         "last 2 edge versions"
    //       ]
    //     },
    //     useBuiltIns: "entry",
    //     modules: false
    //   }
    // ],
    // "@babel/preset-react"
  ];
  const plugins = [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ];

  return {
    presets,
    plugins
  };
};
