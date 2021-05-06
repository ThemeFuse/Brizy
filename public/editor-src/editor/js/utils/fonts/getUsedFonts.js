import { getStore } from "visual/redux/store";
import { unDeletedFontSelector } from "visual/redux/selectors-new";

export function getUsedFontsDetails() {
  const {
    config = {},
    blocks = {},
    google = {},
    upload = {}
  } = unDeletedFontSelector(getStore().getState());

  return {
    config: config.data || [],
    blocks: blocks.data || [],
    google: google.data || [],
    upload: upload.data || []
  };
}

export function getUsedFonts() {
  return Object.values(getUsedFontsDetails()).reduce((acc, cur) => {
    return [...acc, ...cur];
  }, []);
}
