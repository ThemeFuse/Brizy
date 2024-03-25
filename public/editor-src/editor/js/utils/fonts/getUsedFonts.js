import { unDeletedFontsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";

export function getUsedFontsDetails() {
  const {
    config = {},
    blocks = {},
    google = {},
    upload = {}
  } = unDeletedFontsSelector(getStore().getState());

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
