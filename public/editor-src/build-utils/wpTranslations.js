const { extractFromEditor, processTranslations } = require("./utils");

exports.wpTranslations = async function wpTranslations({
  paths,
  IS_PRODUCTION,
  VERSION
}) {
  let translationsArr = [];

  if (IS_PRODUCTION) {
    const translationSets = [await extractFromEditor(paths)];
    translationsArr = processTranslations(translationSets);
  }

  return generateWPFileContent({
    translations: translationsArr,
    IS_PRODUCTION,
    VERSION
  });
};

function generateWPFileContent({ translations, IS_PRODUCTION }) {
  const className = `Brizy_Public_EditorBuild_${
    IS_PRODUCTION ? "Prod" : "Dev"
  }_Texts`;
  const arrBody = translations
    .map((t) => {
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
