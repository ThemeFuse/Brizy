import Config from "visual/global/Config";
import { getFontById } from "visual/utils/fonts";
import { getStore } from "visual/redux/store";
import { globalsSelector } from "visual/redux/selectors";

export function getUsedFonts() {
  const globalsExtraFonts = globalsSelector(getStore().getState()).extraFonts;
  const configFonts = Config.get("fonts").map(getFontById);
  const extraFonts = globalsExtraFonts
    ? globalsExtraFonts.map(getFontById)
    : [];

  return [...extraFonts, ...configFonts];
}

export function getUsedFontsDetails() {
  const globalsExtraFonts = globalsSelector(getStore().getState()).extraFonts;
  const configFonts = Config.get("fonts").map(getFontById);
  const extraFonts = globalsExtraFonts
    ? globalsExtraFonts.map(getFontById)
    : [];

  return {
    extraFonts: extraFonts,
    configFonts: configFonts
  };
}
