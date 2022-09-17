import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import {
  getColorPaletteColor,
  getColorPaletteColors,
  hexToRgba,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import {
  IS_ARCHIVE_TEMPLATE,
  IS_CMS,
  IS_POST,
  IS_PRODUCT_ARCHIVE_TEMPLATE,
  IS_PRODUCT_PAGE,
  IS_PRODUCT_TEMPLATE,
  IS_SINGLE_TEMPLATE
} from "visual/utils/env";
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
import { isPopup, isStory, IS_STORY, setIds } from "visual/utils/models";
import {
  defaultValueKey,
  defaultValueValue,
  mobileSyncOnChange,
  onChangeTypography,
  onChangeTypographyMobile,
  tabletSyncOnChange
} from "visual/utils/onChange";
import {
  getAnimations,
  getDynamicContentByPlaceholder,
  getDynamicContentChoices,
  getOptionColorHexByPalette,
  getShapes
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  toolbarColor2,
  toolbarColorHexField2,
  toolbarElementAudioIconSize,
  toolbarElementAudioUpload,
  toolbarFilterBrightness,
  toolbarFilterContrast,
  toolbarFilterHue,
  toolbarFilterSaturation,
  toolbarLinkPopup,
  toolbarLinkUpload
} from "visual/utils/toolbar";

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
    IS_STORY,
    IS_CMS,

    getAnimations,
    getDynamicContentChoices,
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
    HOVER,

    IS_POST,
    IS_SINGLE_TEMPLATE,
    IS_ARCHIVE_TEMPLATE,
    IS_PRODUCT_TEMPLATE,
    IS_PRODUCT_ARCHIVE_TEMPLATE,
    IS_PRODUCT_PAGE
  },
  toolbar: {
    toolbarColor2,
    toolbarColorHexField2,
    toolbarFilterHue,
    toolbarFilterSaturation,
    toolbarFilterBrightness,
    toolbarFilterContrast,
    toolbarLinkPopup,
    toolbarLinkUpload,
    toolbarElementAudioUpload,
    toolbarElementAudioIconSize
  }
};
