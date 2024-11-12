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

export const getShortcodeComponents = (config: ConfigCommon): Shortcodes => {
  const moduleGroups = config.ui?.leftSidebar?.moduleGroups;

  if (!moduleGroups) {
    return {};
  }

  const is_pro = isPro(config);

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
          (is_pro ? element.component.id !== ElementTypes.MenuSimple : true)
      );

    return { ...components, [label]: items };
  }, {});
};
