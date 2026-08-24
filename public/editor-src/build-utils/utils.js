const fs = require("fs");
const util = require("util");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const readRecursive = util.promisify(require("recursive-readdir"));

const ALLOWED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];
const EXCLUDE_FILE_PARTS = [".test.", ".spec."];
const EXCLUDE_DIRECTORIES = [
  "/libs/",
  "/workers/",
  "/export/",
  "/__tests__/",
  "/node_modules/",
  "/dist/"
];

/**
 * Collects all `t("...")` string literals found inside the given root folders.
 *
 * @param {string[]} rootDirs Absolute paths of the folders to scan.
 * @returns {Promise<Set<string>>}
 */
async function extractTranslations(rootDirs) {
  const translations = new Set();

  for (const rootDir of rootDirs) {
    const files = await readRecursive(rootDir, [
      (file, stats) => {
        if (stats.isDirectory()) {
          return false;
        }

        if (EXCLUDE_DIRECTORIES.some((f) => file.includes(f))) {
          return true;
        }

        const basename = path.basename(file);

        if (EXCLUDE_FILE_PARTS.some((f) => basename.includes(f))) {
          return true;
        }

        const ext = path.extname(file);

        return !ALLOWED_EXTENSIONS.includes(ext);
      }
    ]);

    for (const file of files) {
      const fileString = fs.readFileSync(file, "utf8");

      if (fileString) {
        for (const translation of extractTranslationsFromT(fileString, file)) {
          translations.add(translation);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(`The content of the file are empty ${file}`);
      }
    }
  }

  return translations;
}

function extractTranslationsFromT(code, file) {
  const t = new Set();

  try {
    const ast = parser.parse(code, {
      sourceType: "unambiguous",
      plugins: ["classProperties", "jsx", "typescript"]
    });

    traverse(ast, {
      CallExpression({ node }) {
        if (
          node.callee.name === "t" &&
          node.arguments.length > 0 &&
          node.arguments[0].type === "StringLiteral"
        ) {
          t.add(node.arguments[0].value);
        }
      }
    });
  } catch (_) {
    console.error("Syntax error inside: ", file);
  }

  return t;
}

function processTranslations(translationSets) {
  const translations = new Set();
  for (const set of translationSets) {
    for (const translation of set) {
      translations.add(translation);
    }
  }

  const translationsArr = [...translations];
  translationsArr.sort();
  return translationsArr;
}

module.exports = {
  extractTranslations,
  processTranslations
};
