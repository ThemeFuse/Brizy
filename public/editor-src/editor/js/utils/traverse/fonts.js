import EditorComponents from "visual/global/Editor";
import { modelTraverse, styleTraverse } from "visual/utils/traverse";
import { findFonts, projectFontsData } from "visual/utils/fonts";

const splitFont = ({ type, family }) => `${type}|${family}`;
const unSplitFont = font => {
  const [type, family] = font.split("|");
  return { type, family };
};

export const getUsedModelsFonts = ({ models = {}, globalBlocks = {} }) => {
  const fontFamilies = new Set();

  modelTraverse(models, {
    Component({ type, value }) {
      const defaultStyle =
        EditorComponents.getComponent(type).defaultValue.style || {};

      Object.entries(defaultStyle.families || {}).forEach(fontKeys => {
        const [key, keyValue] = fontKeys;

        fontFamilies.add(
          splitFont({
            type: value[`${key}Type`] || defaultStyle[`${key}Type`],
            family: value[key] || keyValue
          })
        );
      });
    },
    RichText({ type, value }) {
      const { text: dvText } =
        EditorComponents.getComponent(type).defaultValue.content || {};
      const classRgx = /class="(.+?)">/g;
      const familyTypeRgx = /.*?brz-(f(?:[f|t]))-(\w+)+.*?/g;
      let classes;
      const text = value.text || dvText;

      while ((classes = classRgx.exec(text))) {
        let [_, classList] = classes;
        let familyTypes;
        let font = {};

        while ((familyTypes = familyTypeRgx.exec(classList))) {
          const [_, type, name] = familyTypes;

          if (type === "ft") {
            font.type = name;
          }
          if (type === "ff") {
            font.family = name;
          }
        }
        if (font.family) {
          if (font.type) {
            fontFamilies.add(splitFont(font));
          } else {
            // if type doesn't exist
            // set it to google
            // this case is used for old Block
            fontFamilies.add(
              splitFont({
                family: font.family,
                type: "google"
              })
            );
          }
        }
      }
    },
    GlobalBlock({ value: { globalBlockId } }) {
      const globalBlockValue = globalBlocks[globalBlockId];

      if (globalBlockValue) {
        getUsedModelsFonts({ models: globalBlockValue }).forEach(font => {
          fontFamilies.add(splitFont(font));
        });
      }
    }
  });

  return [...fontFamilies].map(unSplitFont);
};

export const getUsedStylesFonts = styles => {
  const fontFamilies = new Set();

  styles.forEach(fontStyle => {
    styleTraverse(fontStyle, {
      fontFamily(value) {
        fontFamilies.add(
          splitFont({
            type: fontStyle["fontFamilyType"],
            family: value
          })
        );
      }
    });
  });

  return [...fontFamilies].map(unSplitFont);
};

export const getBlocksStylesFonts = (fonts, projectFonts_) => {
  const uniqFonts = fonts.reduce((acc, curr) => {
    return acc.some(({ family }) => family === curr.family)
      ? acc
      : [...acc, curr];
  }, []);
  const projectFonts = projectFontsData(projectFonts_);

  return uniqFonts.reduce((acc, curr) => {
    const { type, family } = curr;

    return findFonts(projectFonts[type], family, type) ? acc : [...acc, curr];
  }, []);
};
