const fs = require("fs");
const path = require("path");
const { extractFromEditor, processTranslations } = require("./utils");

exports.cloudTranslations = async function cloudTranslations({
  paths,
  VERSION
}) {
  let translationsArr = [];

  const translationSets = [await extractFromEditor(paths)];
  translationsArr = processTranslations(translationSets);

  await handleTranslationComparison({
    extractedTranslations: translationsArr,
    paths,
    VERSION
  });

  return generateCloudFileContent({
    translations: translationsArr
  });
};

async function handleTranslationComparison({
  extractedTranslations,
  paths,
  VERSION
}) {
  const translationsDir = path.resolve(paths.editor, "../translations");
  const translationsJsonPath = path.resolve(
    translationsDir,
    "translations.json"
  );

  if (!fs.existsSync(translationsDir)) {
    fs.mkdirSync(translationsDir, { recursive: true });
  }

  let existingTranslations = {};
  let hasChanges = false;

  if (fs.existsSync(translationsJsonPath)) {
    try {
      existingTranslations = require(translationsJsonPath);
    } catch (error) {
      console.warn(
        "Failed to parse existing translations.json:",
        error.message
      );
      existingTranslations = {};
    }
  }

  const newTranslations = Object.fromEntries(
    extractedTranslations.map(t => [t, t])
  );

  const addedTranslations = [];
  const allKeys = new Set([
    ...Object.keys(existingTranslations),
    ...Object.keys(newTranslations)
  ]);

  for (const key of allKeys) {
    if (newTranslations[key] && !existingTranslations[key]) {
      addedTranslations.push(key);
      hasChanges = true;
    } else if (existingTranslations[key] && !newTranslations[key]) {
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(
      translationsJsonPath,
      JSON.stringify(newTranslations, null, 2),
      "utf8"
    );
    if (addedTranslations.length > 0) {
      const diffFilePath = path.resolve(
        translationsDir,
        `translations-${VERSION}.txt`
      );
      const diffContent = addedTranslations.join("\n");
      fs.writeFileSync(diffFilePath, diffContent, "utf8");
      console.log(`Translation diff file saved to: ${diffFilePath}`);
    }
  } else {
    console.log("No translation changes detected - skipping file updates");
  }
}

function generateCloudFileContent({ translations }) {
  const translationsObj = {};
  translations.forEach((translation) => {
    translationsObj[translation] = translation;
  });

  return JSON.stringify(translationsObj, null, 2);
}
