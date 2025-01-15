import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Shortcode, ShortcodeComponents } from "visual/types";
import { isLeftSidebarAddElements } from "visual/types/utils";
import { isPro } from "visual/utils/env";
import {
  ShortCodesKeywords,
  getProShortCodes,
  getSampleShortCodes
} from "./Shortcodes";
import { getThirdPartyShortcodesData } from "./utils";

type ShortcodeSource = {
  [key: string]: Shortcode["component"];
};

export function getShortcodeComponents(
  config: ConfigCommon
): ShortcodeComponents {
  const sidebarConfig = config.ui?.leftSidebar;
  if (!sidebarConfig) return [];

  const { topTabsOrder = [], bottomTabsOrder = [] } = sidebarConfig;

  const elementTabs = [...topTabsOrder, ...bottomTabsOrder]
    .filter(isLeftSidebarAddElements)
    .map(({ id, elements }) => ({ tabId: id, elements }));

  if (elementTabs.length === 0) return [];

  const is_pro = isPro(config);

  const { keywords: thirdPartyKeywords, shortcodeData: thirdPartyShortcodes } =
    getThirdPartyShortcodesData(config);

  const shortcodesSources: ShortcodeSource = {
    ...getSampleShortCodes(config),
    ...thirdPartyShortcodes
  };

  const keywords = {
    ...ShortCodesKeywords,
    ...thirdPartyKeywords
  };

  const proShortcodes = getProShortCodes(config);

  return elementTabs.map(({ tabId, elements }) => {
    const shortcodes = Object.fromEntries(
      elements?.map(({ label, moduleNames }) => {
        const components = moduleNames
          .map((component) => ({
            component: shortcodesSources[component],
            pro: proShortcodes[component],
            keywords: keywords[component]
          }))
          .filter(
            (item) =>
              item.component &&
              (!is_pro || item.component.id !== ElementTypes.MenuSimple)
          );

        return [label, components];
      }) ?? []
    );

    return { tabId, shortcodes };
  });
}
