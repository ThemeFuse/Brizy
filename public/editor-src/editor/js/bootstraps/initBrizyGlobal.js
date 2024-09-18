import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { addFilter, applyFilter } from "visual/utils/filters";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";

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
    isBackgroundPointerEnabled,

    isPopup,
    isStory,

    getDynamicContentOption,

    getOptionColorHexByPalette,
    hexToRgba,

    defaultValueValue,
    defaultValueKey,
    DCTypes,
    NORMAL,
    HOVER
  }
};
