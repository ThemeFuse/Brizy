import sharedConfig from "@brizy/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  ...sharedConfig,
  {
    ignores: [
      "**/*.test.{ts,js}",
      "**/__tests__/**",
      "build/",
      "editor/js/libs/",
      "backend/"
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        TARGET: "readonly",
        IS_EXPORT: "readonly",
        COMPILER_TYPE: "readonly",
        AUTHORIZATION_URL: "readonly",
        __CONFIG__: "readonly",
        YT: "readonly",
        getFreeLibs: "readonly",
        getProLibs: "readonly"
      }
    }
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "no-unused-vars": [
        "error",
        {
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true }
      ]
    }
  },
  // Exceptions
  // Disable rules for specific files
  {
    files: ["gulpfile.js", "build-utils/"],
    rules: {
      "no-console": "off"
    }
  }
];
