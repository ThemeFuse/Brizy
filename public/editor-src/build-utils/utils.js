const fs = require("fs");
const util = require("util");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const readRecursive = util.promisify(require("recursive-readdir"));

async function extractFromEditor(paths) {
  const editorJSFolderPath = path.resolve(paths.editor, "./js");
  const allowedExtensions = [".js", ".jsx", ".ts", ".tsx"];
  const excludeDirectories = ["/libs/", "/workers/", "/export/", "/__tests__/"];
  const files = await readRecursive(editorJSFolderPath, [
    (file, stats) => {
      if (stats.isDirectory()) {
        return false;
      }

      if (excludeDirectories.some((f) => file.includes(f))) {
        return true;
      }

      const ext = path.extname(file);

      return !allowedExtensions.includes(ext);
    }
  ]);

  const translations = new Set();
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
  extractFromEditor,
  processTranslations
};
