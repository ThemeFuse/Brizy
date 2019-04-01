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
        useBuiltIns: "entry",
        modules: false
      }
    ],
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
    "@babel/plugin-proposal-object-rest-spread"
  ];

  return {
    presets,
    plugins
  };
};

exports.export = () => {
  const { presets, plugins } = exports.editor();

  return {
    presets,
    plugins: [...plugins, "transform-remove-console"]
  };
};

exports.preview = () => {
  const { presets, plugins } = exports.editor();
  const clonedPresets = JSON.parse(JSON.stringify(presets));

  clonedPresets[0][1].targets.browsers = ["IE 11"];

  return {
    presets: clonedPresets,
    plugins
  };
};
