const fs = require("fs");
const path = require("path");
const util = require("util");
const argv_ = require("minimist")(process.argv.slice(2));
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const readRecursive = util.promisify(require("recursive-readdir"));

const IS_PRODUCTION = Boolean(argv_.production);

const paths = {
  src: path.resolve("./src") ?? argv_.src,
  build: path.resolve("./build") ?? argv_.build
};

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

async function extractFromSrc(paths) {
  const editorJSFolderPath = path.resolve(paths.src);
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

function generateFileContent(translations) {
  const className = "Brizy_Public_EditorClient_Build_Texts";
  const arrBody = translations
    .map((t) => {
      // eslint-disable-next-line
      const _t = t.replace(/"/g, '\\"');
      return `\t\t\t"${_t}" => __("${_t}", "brizy")`;
    })
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

async function translations({ paths, IS_PRODUCTION }) {
  let translationsArr = [];

  if (IS_PRODUCTION) {
    const translationSets = [await extractFromSrc(paths)];

    const translations = new Set();
    for (const set of translationSets) {
      for (const translation of set) {
        translations.add(translation);
      }
    }

    translationsArr = [...translations];
    translationsArr.sort();
  }

  return generateFileContent(translationsArr);
}

async function translate() {
  const folder = paths.build;

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  let dest = path.resolve(paths.build, "texts.php");
  let phpSourceCode = await translations({ paths, IS_PRODUCTION });

  fs.writeFileSync(dest, phpSourceCode, "utf8");
}

exports.translate = translate;
