import Config from "visual/global/Config";
import { addFilter, applyFilter } from "visual/utils/filters";
import { t } from "visual/utils/i18n";
import { setIds } from "visual/utils/models";
import {
  getOptionColor,
  getAnimations,
  getDynamicContentChoices,
  getDynamicContentByPlaceholder,
  getShapes
} from "visual/utils/options";
import {
  hexToRgba,
  getColorPaletteColors,
  getColorPaletteColor,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import {
  getFontById,
  getUsedFonts,
  getUsedFontsDetails,
  getFontStyles,
  getFontStyle,
  weightTypes,
  getWeight,
  getWeightChoices,
  makeFontsUrl,
  makeRichTextFontFamiliesCSS,
  makeRichTextFontStylesCSS
} from "visual/utils/fonts";
import {
  tabletSyncOnChange,
  mobileSyncOnChange,
  onChangeTypography,
  onChangeTypographyMobile
} from "visual/utils/onChange";
import { toolbarCustomCSS } from "visual/utils/toolbar";

global.Brizy = {
  config: Config,
  addFilter,
  applyFilter,
  t,
  utils: {
    setIds,

    getAnimations,
    getDynamicContentChoices,
    getDynamicContentByPlaceholder,
    getShapes,

    getOptionColor,
    hexToRgba,
    getColorPaletteColors,
    getColorPaletteColor,
    makeRichTextColorPaletteCSS,

    getFontById,
    getUsedFonts,
    getUsedFontsDetails,
    getFontStyles,
    getFontStyle,
    weightTypes,
    getWeight,
    getWeightChoices,
    makeFontsUrl,
    makeRichTextFontFamiliesCSS,
    makeRichTextFontStylesCSS,

    tabletSyncOnChange,
    mobileSyncOnChange,
    onChangeTypography,
    onChangeTypographyMobile
  },
  toolbar: {
    toolbarCustomCSS
  }
};
