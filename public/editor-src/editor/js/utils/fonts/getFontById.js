import _ from "underscore";
import { getStore } from "visual/redux/store";
import { projectSelector, fontSelector } from "visual/redux/selectors";

import { unDeletedFontSelector } from "visual/redux/selectors-new";
import { findFonts, fontTransform, projectFontsData } from "visual/utils/fonts";

export const getFontById = ({ type, family }) => {
  const usedFonts = projectFontsData(
    unDeletedFontSelector(getStore().getState())
  );

  const font = findFonts(usedFonts[type], family, type);

  // Transform original Font Schema to Editor Font Schema
  if (font) {
    return fontTransform[type](font);
  }

  const defaultFont = getDefaultFont();
  return fontTransform[defaultFont.group](defaultFont.font);
};

export const getGroupFontsById = (fonts, fontId) => {
  return Object.entries(fonts).reduce((acc, curr) => {
    const [group, { data = [] }] = curr;
    const font = data.find(font => fontId === fontTransform[group](font).id);

    return font ? { group, font } : acc;
  }, null);
};

export const getDefaultFont = _.memoize(() => {
  const store = getStore().getState();
  const { font } = projectSelector(store).data;
  const { config } = fontSelector(store);

  return {
    group: "config",
    font: findFonts(config.data, font)
  };
});
