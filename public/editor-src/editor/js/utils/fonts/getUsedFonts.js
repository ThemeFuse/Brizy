import Config from "visual/global/Config";
import { getFontById } from "visual/utils/fonts";
import { getStore } from "visual/redux/store";

export function getUsedFonts() {
  const {
    globals: { project: { extraFonts: globalsExtraFonts } }
  } = getStore().getState();

  const configFonts = Config.get("fonts").map(getFontById);
  const extraFonts = globalsExtraFonts
    ? globalsExtraFonts.map(getFontById)
    : [];

  return [...extraFonts, ...configFonts];
}

export function getUsedFontsDetails() {
  const {
    globals: { project: { extraFonts: globalsExtraFonts } }
  } = getStore().getState();

  const configFonts = Config.get("fonts").map(getFontById);
  const extraFonts = globalsExtraFonts
    ? globalsExtraFonts.map(getFontById)
    : [];

  return {
    extraFonts: extraFonts,
    configFonts: configFonts
  };
}
