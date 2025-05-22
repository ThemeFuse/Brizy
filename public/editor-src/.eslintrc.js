module.exports = {
  root: true,
  extends: ["@brizy/eslint-config"],
  env: {
    es6: true,
    browser: true
  },
  globals: {
    TARGET: "readonly",
    IS_EXPORT: "readonly",
    COMPILER_TYPE: "readonly",
    AUTHORIZATION_URL: "readonly",
    __CONFIG__: "readonly",
    YT: "readonly",
    getFreeLibs: "readonly",
    getProLibs: "readonly"
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["plugin:react-hooks/recommended", "prettier"],
      rules: {
        "react/prop-types": 0,
        "react/no-unknown-property": 0
      }
    }
  ]
};
