import { addDefaults } from "timm";
import { Prompt } from "visual/component/Prompts/api";
import {
  ConfigCommon,
  LeftSidebarOptionsIds,
  LeftSidebarPageSettingsOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import { isPopup, isStory, isTemplate } from "visual/utils/models/modes";

type Sidebar = Required<ConfigCommon>["ui"]["leftSidebar"];

export const addDefault = <C extends ConfigCommon>(config: C): C => {
  // @ts-expect-error: This defaultConfig will be deleted whe it would be on backend
  const { urls = {}, ui = {} } = config;
  const is_popup = isPopup(config);
  const is_story = isStory(config);
  const topOrder: Array<LeftSidebarOptionsIds> = [
    LeftSidebarOptionsIds.addElements,
    LeftSidebarOptionsIds.reorderBlock,
    LeftSidebarOptionsIds.globalStyle
  ];
  const bottomOrder: Array<LeftSidebarOptionsIds> = [
    LeftSidebarOptionsIds.deviceMode,
    LeftSidebarOptionsIds.pageSettings,
    LeftSidebarOptionsIds.more
  ];

  const sidebar: Sidebar = {
    topTabsOrder: topOrder,
    bottomTabsOrder: bottomOrder,

    pageSettings: {
      options: {
        [LeftSidebarPageSettingsOptionsIds.template]: !(is_popup || is_story),
        [LeftSidebarPageSettingsOptionsIds.membership]: !(is_popup || is_story),
        [LeftSidebarPageSettingsOptionsIds.featuredImage]:
          !(is_popup || is_story) && !isTemplate(config)
      }
    },
    more: {
      options: [
        {
          type: "link",
          icon: "nc-unlock",
          label: t("Upgrade to Pro"),
          link: urls.upgradeToPro,
          linkTarget: "_blank",
          // @ts-expect-error: temporary this code need to be on backend side
          disabled: !!config.pro
        },
        {
          type: "link",
          icon: "nc-info",
          label: t("About us"),
          link: urls.about,
          linkTarget: "_blank"
        },
        {
          type: "link",
          icon: "nc-help-docs",
          label: t("Support"),
          link: urls.support,
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
          icon: "nc-cog",
          label: t("Plugin Settings"),
          link: urls.pluginSettings,
          linkTarget: "_blank",
          roles: ["admin"]
        },
        {
          type: "link",
          icon: "nc-back",
          label: t("Go to Dashboard"),
          link: urls.backToDashboard
        }
      ]
    }
  };

  const defaultUI = {
    leftSidebar: addDefaults(ui.leftSidebar ?? {}, sidebar ?? {})
  };
  const _ui = addDefaults(config.ui ?? {}, defaultUI);

  return Object.assign(config, { ui: _ui });
};
