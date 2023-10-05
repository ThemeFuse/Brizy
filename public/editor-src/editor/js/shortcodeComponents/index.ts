import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Shortcodes } from "visual/types";
import { isPro } from "visual/utils/env";
import { events, forms, groups, sermons } from "./MinistryBrands";
import { CloudShortCodes, ProShortCodes, WPShortCodes } from "./Shortcodes";

const _config = Config.getAll();

const IS_PRO = isPro(_config);

const ministryContent = ((): Shortcodes => {
  if (isCloud(_config) && _config.modules?.ekklesia) {
    return {
      Sermons: sermons,
      Events: events,
      Groups: groups,
      Forms: forms
    };
  }

  return {};
})();

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
        pro: ProShortCodes[component as keyof typeof ProShortCodes]
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
  return { ...normalizeShortCodes(_config), ...ministryContent };
})();

export default config;
