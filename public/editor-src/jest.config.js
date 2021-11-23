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
    },
    __VISUAL_CONFIG__: {
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
