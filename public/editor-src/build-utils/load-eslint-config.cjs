/**
 * Helper to load and merge ESLint configs
 * Loads @brizy/eslint-config (ESM) and merges with browser compatibility config
 */

const compatPlugin = require("eslint-plugin-compat");
const tseslint = require("typescript-eslint");
const globals = require("globals");
const swcrc = require("../swc.config.all");

async function loadPreviewEslintConfig() {
  const sharedConfigModule = await import("@brizy/eslint-config");
  const sharedConfig = sharedConfigModule.default;

  return [
    ...sharedConfig,
    // Global overrides (browser globals, compat checking)
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          // Custom globals from visual/eslint.config.mjs
          TARGET: "readonly",
          IS_EXPORT: "readonly",
          COMPILER_TYPE: "readonly",
          AUTHORIZATION_URL: "readonly",
          __CONFIG__: "readonly",
          YT: "readonly",
          getFreeLibs: "readonly",
          getProLibs: "readonly"
        }
      },
      plugins: {
        compat: compatPlugin
      },
      settings: {
        targets: swcrc.previewBrowserlist,
        lintAllEsApis: false,
        polyfills: []
      },
      rules: {
        // Browser compatibility checking
        "compat/compat": "error"
      },
      linterOptions: {
        reportUnusedDisableDirectives: "off"
      }
    },
    // JavaScript file overrides (from visual/eslint.config.mjs)
    {
      files: ["**/*.{js,jsx}"],
      rules: {
        // Allow unused vars with _ prefix (common pattern for unused parameters)
        "no-unused-vars": [
          "error",
          {
            varsIgnorePattern: "^_",
            argsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_"
          }
        ]
      }
    },
    // TypeScript/JavaScript file overrides (from visual/eslint.config.mjs)
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: {
        "@typescript-eslint": tseslint.plugin
      },
      rules: {
        // Turn off no-unused-expressions for preview builds
        // This rule causes issues with legacy jQuery code that uses comma operators
        // extensively (e.g., jquery.parallax.js uses patterns like: a && b(), c = d)
        "@typescript-eslint/no-unused-expressions": "off",
        "no-unused-expressions": "off"
      }
    }
  ];
}

module.exports = { loadPreviewEslintConfig };
