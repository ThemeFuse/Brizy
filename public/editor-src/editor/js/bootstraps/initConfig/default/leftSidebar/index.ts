import deepMerge from "deepmerge";
import { addDefaults } from "timm";
import { Prompt } from "visual/component/Prompts/api";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import {
  ConfigCommon,
  LeftSidebarOptionsIds,
  LeftSidebarPageSettingsOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import {
  isExternalPopup,
  isExternalStory,
  isPopup,
  isStory
} from "visual/utils/models/modes";
import { overwriteMerge } from "../utils";

type Sidebar = Required<ConfigCommon>["ui"]["leftSidebar"];

export const addDefault = <C extends ConfigCommon>(config: C): C => {
  // @ts-expect-error: This defaultConfig will be deleted whe it would be on backend
  const { urls = {}, ui = {} } = config;
  const is_popup = isPopup(config);
  const is_story = isStory(config);
  const is_shopify = isCloud(config) && isShopify(config);

  const topOrder: Array<LeftSidebarOptionsIds> = [];
  const bottomOrder: Array<LeftSidebarOptionsIds> = [
    LeftSidebarOptionsIds.deviceMode,
    LeftSidebarOptionsIds.pageSettings,
    LeftSidebarOptionsIds.more
  ];

  if (!(isExternalStory(config) || isExternalPopup(config))) {
    topOrder.push(LeftSidebarOptionsIds.cms);
  }

  topOrder.push(LeftSidebarOptionsIds.addElements);
  topOrder.push(LeftSidebarOptionsIds.reorderBlock);

  if (!is_shopify) {
    topOrder.push(LeftSidebarOptionsIds.globalStyle);
  }

  if (!(is_popup || is_story)) {
    topOrder.push(LeftSidebarOptionsIds.collaboration);
  }

  const sidebar: Sidebar = {
    topTabsOrder: topOrder,
    bottomTabsOrder: bottomOrder,

    pageSettings: {
      options: {
        [LeftSidebarPageSettingsOptionsIds.membership]: !(
          is_popup ||
          is_story ||
          is_shopify
        ),
        [LeftSidebarPageSettingsOptionsIds.language]: !(
          is_popup ||
          is_story ||
          is_shopify
        )
      }
    },
    more: {
      options: [
        {
          type: "link",
          icon: "nc-info",
          label: t("About us"),
          link: urls.about,
          // @ts-expect-error: temporary
          disabled: !urls.about,
          linkTarget: "_blank"
        },
        {
          type: "link",
          icon: "nc-help-docs",
          label: t("Support"),
          link: urls.support,
          // @ts-expect-error: temporary
          disabled: !urls.support,
          linkTarget: "_blank",
          roles: ["admin"]
        },
        {
          type: "link",
          icon: "nc-alert-circle-que",
          label: t("Shortcuts"),
          link: "#",
          // @ts-expect-error: temporary
          onClick: (e: MouseEvent): void => {
            e.preventDefault();

            Prompt.open({
              mode: "stack",
              prompt: "keyHelper"
            });
          }
        },
        {
          type: "link",
          icon: "nc-back",
          // @ts-expect-error: temporary
          disabled: !urls.backToDashboard,
          label: t("Go to Dashboard"),
          link: urls.backToDashboard
        }
      ]
    }
  };

  const defaultUI = {
    leftSidebar: addDefaults(ui.leftSidebar ?? {}, sidebar ?? {})
  };
  const _ui = deepMerge(defaultUI, ui, { arrayMerge: overwriteMerge });

  return Object.assign(config, { ui: _ui });
};
