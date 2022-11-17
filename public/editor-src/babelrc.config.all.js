const basicOptions = {
  sourceType: "unambiguous"
};

exports.editor = () => {
  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: [
            "last 2 chrome versions",
            "last 2 firefox versions",
            "last 2 safari versions",
            "last 2 edge versions"
          ]
        },
        corejs: "3.26.0",
        useBuiltIns: "usage",
        modules: false
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ];
  const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: false,
        useESModules: true
      }
    ],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ];

  return {
    ...basicOptions,
    presets,
    plugins
  };
};

exports.export = () => {
  const { presets, plugins } = exports.editor();
  const clonedPresets = JSON.parse(JSON.stringify(presets));

  clonedPresets[0][1].targets.node = "12";

  return {
    ...basicOptions,
    presets: clonedPresets,
    plugins: [...plugins, "transform-remove-console"]
  };
};

exports.preview = () => {
  const { presets, plugins } = exports.editor();
  const clonedPresets = JSON.parse(JSON.stringify(presets));

  clonedPresets[0][1].targets.browsers = ["> 0.5%", "last 2 versions"];

  return {
    ...basicOptions,
    presets: clonedPresets,
    plugins
  };
};
