import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Shortcodes } from "visual/types";
import { isPro } from "visual/utils/env";
import {
  CloudShortCodes,
  ProShortCodes,
  ShortCodesKeywords,
  WPShortCodes
} from "./Shortcodes";

const _config = Config.getAll();

const IS_PRO = isPro(_config);

const normalizeShortCodes = (config: ConfigCommon) => {
  const moduleGroups = config.ui?.leftSidebar?.moduleGroups;

  if (!moduleGroups) {
    return {};
  }

  return moduleGroups.reduce((components, { label, moduleNames }) => {
    const items = moduleNames
      .map((component) => ({
        component:
          CloudShortCodes[component as keyof typeof CloudShortCodes] ||
          WPShortCodes[component as keyof typeof WPShortCodes],
        pro: ProShortCodes[component as keyof typeof ProShortCodes],
        keywords:
          ShortCodesKeywords[component as keyof typeof ShortCodesKeywords]
      }))
      .filter(
        (element) =>
          Boolean(element.component) &&
          (IS_PRO ? element.component.id !== ElementTypes.MenuSimple : true)
      );

    return { ...components, [label]: items };
  }, {});
};

const config = ((): Shortcodes => {
  return normalizeShortCodes(_config);
})();

export default config;
