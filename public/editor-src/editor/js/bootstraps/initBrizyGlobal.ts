import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import {
  isPopup as isPopupMode,
  isStory as isStoryMode
} from "visual/providers/EditorModeProvider";
import { hexToRgba } from "visual/utils/color";
import { addFilter, applyFilter } from "visual/utils/filters";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

global.Brizy = {
  config: Config,
  addFilter,
  applyFilter,
  t,
  utils: {
    context: {
      // TODO: after finish https://github.com/bagrinsergiu/blox-editor/issues/27400,
      //  replace old (isPopup, isStory) with these function
      isPopup: isPopupMode,
      isStory: isStoryMode
    },
    stateMode: {
      NORMAL,
      HOVER
    },
    isBackgroundPointerEnabled,

    isPopup,
    isStory,

    getDynamicContentOption,

    hexToRgba,

    defaultValueValue,
    defaultValueKey,
    DCTypes,
    NORMAL,
    HOVER
  }
};
