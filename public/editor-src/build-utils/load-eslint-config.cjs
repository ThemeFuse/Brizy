/**
 * The only remaining ESLint use in the repo.
 *
 * Linting moved to Biome, but Biome has no equivalent of eslint-plugin-compat,
 * which gates the production preview bundle against `previewBrowserlist`. So
 * ESLint survives here as a single-rule browser-compatibility check and nothing
 * else — it does not lint style, correctness or anything Biome now owns.
 *
 * `noInlineConfig` is load-bearing: source files still carry suppression
 * comments, and ESLint hard-errors on a directive naming a rule it has not
 * loaded. Ignoring inline config entirely is what keeps this pass independent
 * of whatever Biome suppressions live in the tree.
 */

const compatPlugin = require("eslint-plugin-compat");
const tseslint = require("typescript-eslint");
const swcrc = require("../swc.config.all");

async function loadPreviewEslintConfig() {
  return [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      languageOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        sourceType: "module",
        parserOptions: {
          ecmaFeatures: { jsx: true }
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
        "compat/compat": "error"
      },
      linterOptions: {
        noInlineConfig: true,
        reportUnusedDisableDirectives: "off"
      }
    }
  ];
}

module.exports = { loadPreviewEslintConfig };
