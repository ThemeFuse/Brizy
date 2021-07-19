module.exports = {
  moduleNameMapper: {
    "^visual/(.*)$": "<rootDir>/editor/js/$1"
  },
  transform: {
    "\\.(tsx|ts|js)?$": "ts-jest"
  },
  globals: {
    TARGET: "Jest",
    IS_EDITOR: true,
    "ts-jest": {
      babelConfig: true
    }
  }
};
