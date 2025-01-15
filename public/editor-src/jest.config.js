const swcConfig = {
  module: {
    type: "commonjs"
  },
  jsc: {
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

module.exports = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "jest-utils", "__dirname"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "^visual/(.*)$": "<rootDir>/editor/js/$1"
  },
  transform: {
    "\\.(tsx|ts|js|jsx)?$": ["@swc/jest", swcConfig]
  },
  transformIgnorePatterns: ["/node_modules/(?!(nanoid|normalize-url)/)"],
  globals: {
    TARGET: "Jest",
    IS_EDITOR: true,
    __VISUAL_CONFIG__: {
      pageData: {
        id: "",
        data: ""
      },
      imageSizes: [
        {
          label: "Original",
          name: "original"
        },
        {
          width: 150,
          height: 150,
          label: "Thumbnail - 150 x 150",
          name: "thumbnail"
        },
        {
          width: 300,
          height: 300,
          label: "Medium - 300 x 300",
          name: "medium"
        },
        {
          width: 1024,
          height: 1024,
          label: "Large - 1024 x 1024",
          name: "large"
        },
        {
          width: 1536,
          height: 1536,
          label: "1536x1536 - 1536 x 1536",
          name: "1536x1536"
        }
      ]
    }
  }
};
