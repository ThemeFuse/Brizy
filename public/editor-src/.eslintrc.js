module.exports = {
  root: true,
  extends: ["@brizy/eslint-config"],
  env: {
    es6: true,
    browser: true
  },
  globals: {
    TARGET: "readonly",
    IS_EDITOR: "readonly",
    IS_PREVIEW: "readonly",
    IS_EXPORT: "readonly",
    AUTHORIZATION_URL: "readonly",
    __CONFIG__: "readonly",
    YT: "readonly",
    getFreeLibs: "readonly",
    getProLibs: "readonly"
  },
  rules: {
    "graphql/template-strings": [
      "error",
      {
        env: "apollo",
        tagName: "gql",
        validators: [
          "ExecutableDefinitionsRule",
          "FieldsOnCorrectTypeRule",
          "KnownArgumentNamesRule",
          "KnownDirectivesRule",
          "KnownTypeNamesRule",
          "LoneAnonymousOperationRule",
          "NoFragmentCyclesRule",
          "NoUndefinedVariablesRule",
          "OverlappingFieldsCanBeMergedRule",
          "PossibleFragmentSpreadsRule",
          "ProvidedRequiredArgumentsRule",
          "ScalarLeafsRule",
          "SingleFieldSubscriptionsRule",
          "UniqueArgumentNamesRule",
          "UniqueDirectivesPerLocationRule",
          "UniqueFragmentNamesRule",
          "UniqueInputFieldNamesRule",
          "UniqueOperationNamesRule",
          "UniqueVariableNamesRule",
          "ValuesOfCorrectTypeRule",
          "VariablesAreInputTypesRule",
          "VariablesInAllowedPositionRule"
        ],
        schemaJsonFilepath: "./editor/js/utils/api/cms/graphql/schema.json"
      }
    ]
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "prettier"
      ],
      plugins: ["graphql"],
      rules: {
        "react/prop-types": 0,
        "react/no-unknown-property": 0
      }
    }
  ]
};
