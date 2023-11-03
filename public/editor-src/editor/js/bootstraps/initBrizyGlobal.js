import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import {
  getColorPaletteColor,
  getColorPaletteColors,
  hexToRgba,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import { addFilter, applyFilter } from "visual/utils/filters";
import {
  getFontById,
  getFontStyle,
  getFontStyles,
  getUsedFonts,
  getUsedFontsDetails,
  getWeight,
  getWeightChoices,
  makeSubsetGoogleFontsUrl,
  weightTypes
} from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { isPopup, isStory, setIds } from "visual/utils/models";
import {
  defaultValueKey,
  defaultValueValue,
  mobileSyncOnChange,
  onChangeTypography,
  onChangeTypographyMobile,
  tabletSyncOnChange
} from "visual/utils/onChange";
import {
  getDynamicContentByPlaceholder,
  getDynamicContentChoices,
  getDynamicContentOption,
  getOptionColorHexByPalette,
  getShapes
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarLinkPopup } from "visual/utils/toolbar";

global.Brizy = {
  config: Config,
  addFilter,
  applyFilter,
  t,
  utils: {
    stateMode: {
      NORMAL,
      HOVER
    },

    setIds,
    isPopup,
    isStory,

    getDynamicContentChoices,
    getDynamicContentOption,
    getDynamicContentByPlaceholder,
    getShapes,

    getOptionColorHexByPalette,
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
    makeSubsetGoogleFontsUrl,

    defaultValueValue,
    defaultValueKey,
    tabletSyncOnChange,
    mobileSyncOnChange,
    onChangeTypography,
    onChangeTypographyMobile,
    DCTypes,
    NORMAL,
    HOVER
  },
  toolbar: {
    toolbarLinkPopup
  }
};
