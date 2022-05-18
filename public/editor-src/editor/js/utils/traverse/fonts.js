import { modelTraverse, styleTraverse } from "visual/utils/traverse";
import { findFonts, projectFontsData } from "visual/utils/fonts";
import { getComponentDefaultValue, splitFont, unSplitFont } from "./common";

import { mapBlockElements } from "visual/editorComponents/RichText/utils";
import { classNamesToV } from "visual/editorComponents/RichText/utils/transforms";

export const getUsedModelsFonts = ({ models = {}, globalBlocks = {} }) => {
  const fontFamilies = new Set();

  modelTraverse(models, {
    Component({ type, value }) {
      const defaultStyle = getComponentDefaultValue(type).style || {};
      const style = { ...defaultStyle, ...value };

      // if exist fontStyle don't need current fontFamily
      // in this case fontFamily is global
      if (style.fontStyle) {
        return;
      }

      Object.entries(defaultStyle.families || {}).forEach(fontKeys => {
        const [key, keyValue] = fontKeys;
        const font = {
          type: value[`${key}Type`] || defaultStyle[`${key}Type`],
          family: value[key] || keyValue
        };

        if (font.type && font.family) {
          fontFamilies.add(splitFont(font));
        }
      });
    },
    RichText({ type, value }) {
      const defaultValue = getComponentDefaultValue(type).content || {};
      const text = value.text || defaultValue.text;

      mapBlockElements(text, elem => {
        const v = classNamesToV(elem);
        const { typographyFontFamily, typographyFontFamilyType } = v;

        if (typographyFontFamily) {
          if (typographyFontFamilyType) {
            fontFamilies.add(
              splitFont({
                type: typographyFontFamilyType,
                family: typographyFontFamily
              })
            );
          } else {
            // if type doesn't exist
            // set it to unknowns
            // and parse all fonts
            fontFamilies.add(
              splitFont({
                family: typographyFontFamily,
                type: "unknowns"
              })
            );
          }
        }
      });
    },
    GlobalBlock({ value: { _id } }) {
      const globalBlockValue = globalBlocks[_id];

      if (globalBlockValue) {
        const models = { models: globalBlockValue, globalBlocks };

        getUsedModelsFonts(models).forEach(font => {
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

    // find in all project -> fonts
    if (type === "unknowns") {
      return Object.entries(projectFonts).find(([type, data]) =>
        findFonts(data, family, type)
      )
        ? acc
        : [...acc, curr];
    }

    return findFonts(projectFonts[type], family, type) ? acc : [...acc, curr];
  }, []);
};
