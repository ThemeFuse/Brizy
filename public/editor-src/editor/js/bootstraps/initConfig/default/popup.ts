import deepMerge from "deepmerge";
import { addDefaults } from "timm";
import {
  ConfigCommon,
  PopupSettings
} from "visual/global/Config/types/configs/ConfigCommon";
import { isPopup } from "visual/utils/models/modes";
import { overwriteMerge } from "./utils";

export const defaultPopupSettings: PopupSettings = {
  deletePopup: true,
  displayCondition: true
};

export const addDefault = <C extends ConfigCommon>(config: C): C => {
  if (isPopup(config)) {
    const { ui = {} } = config;
    const defaultUI = {
      popupSettings: addDefaults(ui.popupSettings ?? {}, defaultPopupSettings)
    };
    const _ui = deepMerge(defaultUI, ui, { arrayMerge: overwriteMerge });

    return Object.assign(config, { ui: _ui });
  }

  return config;
};
