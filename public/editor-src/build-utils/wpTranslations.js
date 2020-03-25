const fs = require("fs");
const util = require("util");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const readRecursive = util.promisify(require("recursive-readdir"));

exports.wpTranslations = async function wpTranslations({
  paths,
  IS_PRODUCTION,
  VERSION
}) {
  let translationsArr = [];

  if (IS_PRODUCTION) {
    const translationSets = [
      await extractFromEditor(paths),
      extractFromKits(paths),
      extractFromTemplates(paths)
    ];

    const translations = new Set();
    for (const set of translationSets) {
      for (const translation of set) {
        translations.add(translation);
      }
    }

    translationsArr = [...translations];
    translationsArr.sort();
  }

  return generateWPFileContent({
    translations: translationsArr,
    IS_PRODUCTION,
    VERSION
  });
};

async function extractFromEditor(paths) {
  const editorJSFolderPath = path.resolve(paths.editor, "./js");
  const allowedExtensions = [".js", ".jsx", ".ts", ".tsx"];
  const files = await readRecursive(editorJSFolderPath, [
    (file, stats) => {
      if (stats.isDirectory()) {
        return false;
      }

      const ext = path.extname(file);

      return !allowedExtensions.includes(ext);
    }
  ]);

  const translations = new Set();
  for (const file of files) {
    const fileString = fs.readFileSync(file, "utf8");

    for (const translation of extractTranslationsFromT(fileString)) {
      translations.add(translation);
    }
  }

  return translations;
}

function extractFromKits(paths) {
  const kitsIndexFilePath = path.resolve(paths.kits, "./index.js");
  const kits = require(kitsIndexFilePath);

  return kits.reduce((acc, kit) => {
    for (const type of kit.types) {
      acc.add(type.title);
    }

    for (const category of kit.categories) {
      acc.add(category.title);
    }

    return acc;
  }, new Set());
}

function extractFromTemplates(paths) {
  const templateIndexFilePath = path.resolve(paths.templates, "./index.js");
  const templates = require(templateIndexFilePath);

  return templates.categories.reduce((acc, category) => {
    acc.add(category.title);

    return acc;
  }, new Set());
}

function extractTranslationsFromT(code) {
  const ast = parser.parse(code, {
    sourceType: "unambiguous",
    plugins: ["classProperties", "jsx", "typescript"]
  });

  const t = new Set();
  traverse(ast, {
    CallExpression({ node }) {
      if (
        node.callee.name === "t" &&
        // In rare cases the function is called with a variable instead of a string literal.
        // Omit those here because those require to customize the build individually
        node.arguments[0].type === "StringLiteral"
      ) {
        t.add(node.arguments[0].value);
      }
    }
  });

  return t;
}

function generateWPFileContent({ translations, IS_PRODUCTION, VERSION }) {
  const className = `Brizy_Public_EditorBuild_${
    IS_PRODUCTION
      ? VERSION.split("-")
          .map(capitalize)
          .join("")
      : "Dev"
  }_Texts`;
  const arrBody = translations
    .map(t => `\t\t\t"${t}" => __("${t}", "brizy")`)
    .join(",\n");
  const arr = [
    "<?php",
    "",
    `class ${className} {`,
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

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
