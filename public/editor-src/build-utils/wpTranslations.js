const fs = require("fs");
const util = require("util");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const readRecursive = util.promisify(require("recursive-readdir"));

exports.wpTranslations = async function wpTranslations(path) {
  const translations = await extractTranslations(path);
  const wPFileContent = generateWPFileContent(translations);

  return wPFileContent;
};

exports.wpTranslationsDev = async function wpTranslationsDev() {
  const wPFileContent = generateWPFileContent([]);

  return wPFileContent;
};

async function extractTranslations(path_) {
  const files = await readRecursive(path_, [
    (file, stats) => {
      if (stats.isDirectory()) {
        return false;
      }

      const ext = path.extname(file);

      return ext !== ".js" && ext !== ".jsx";
    }
  ]);

  const translations = new Set();
  for (const file of files) {
    const fileString = fs.readFileSync(file, "utf8");

    for (const translation of extractTranslationsFromString(fileString)) {
      translations.add(translation);
    }
  }

  return [...translations].sort();
}

function extractTranslationsFromString(code) {
  const ast = parser.parse(code, {
    sourceType: "unambiguous",
    plugins: ["classProperties", "jsx"]
  });

  const t = new Set();
  traverse(ast, {
    CallExpression({ node }) {
      if (node.callee.name === "t") {
        t.add(node.arguments[0].value);
      }
    }
  });

  return t;
}

function generateWPFileContent(translations) {
  const arrBody = translations
    .map(t => `\t\t\t"${t}" => __("${t}", "brizy")`)
    .join(",\n");
  const arr = [
    "<?php",
    "",
    "class Brizy_Public_EditorBuild_Texts {",
    "\tpublic static function get_editor_texts() {",
    "\t\treturn apply_filters('brizy_editor_config_texts', array(",
    arrBody,
    "\t\t));",
    "\t}",
    "}",
    ""
  ].join("\n");

  return arr;
}
