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
        corejs: "3.7.0",
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

  clonedPresets[0][1].targets.node = "8";

  return {
    ...basicOptions,
    presets: clonedPresets,
    plugins: [...plugins, "transform-remove-console"]
  };
};

exports.preview = () => {
  const { presets, plugins } = exports.editor();
  const clonedPresets = JSON.parse(JSON.stringify(presets));

  clonedPresets[0][1].targets.browsers = [
    "chrome 85",
    "edge 85",
    "firefox 81",
    "safari 14"
  ];

  return {
    ...basicOptions,
    presets: clonedPresets,
    plugins
  };
};
