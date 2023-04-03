import deepMerge from "deepmerge";
import { addDefaults } from "timm";
import {
  ConfigCommon,
  PopupSettings
} from "visual/global/Config/types/configs/ConfigCommon";
import { isPopup } from "visual/utils/models/modes";
import { overwriteMerge } from "./utils";

const defaultGlobalPopup: PopupSettings = {
  displayCondition: true,
  deletePopup: true
};

export const defaultPopup: PopupSettings = {
  horizontalAlign: true,
  verticalAlign: true,
  embedded: false,
  displayCondition: false,
  scrollPageBehind: true,
  clickOutsideToClose: true
};

export const addDefault = <C extends ConfigCommon>(config: C): C => {
  if (isPopup(config)) {
    const { ui = {} } = config;
    const defaultUI = {
      popupSettings: addDefaults(ui.popupSettings ?? {}, {
        ...defaultPopup,
        ...defaultGlobalPopup
      })
    };
    const _ui = deepMerge(defaultUI, ui, { arrayMerge: overwriteMerge });

    return Object.assign(config, { ui: _ui });
  }

  const { ui = {} } = config;
  const defaultUI = {
    popupSettings: addDefaults(ui.popupSettings ?? {}, defaultPopup)
  };

  const _ui = deepMerge(defaultUI, ui, { arrayMerge: overwriteMerge });
  return Object.assign(config, { ui: _ui });
};
