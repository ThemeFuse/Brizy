import { MouseEvent } from "react";
import Config, { WP } from "visual/global/Config";
import Prompts from "visual/component/Prompts";
import { Base } from "./components/AddElements";
import { BlocksSortable } from "./components/BlocksSortable";
import { Styling } from "./components/Styling";
import { DeviceModes } from "./components/DeviceModes";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP, IS_TEMPLATE, IS_STORY } from "visual/utils/models";
import { IS_PRO } from "visual/utils/env";

const { urls } = Config.getAll() as WP;

export default {
  top: [Base, BlocksSortable, Styling],
  bottom: [
    DeviceModes,
    {
      id: "popover",
      icon: "nc-page",
      title: t("Page"),
      type: "popover",
      disabled: IS_GLOBAL_POPUP || IS_STORY,
      options: [
        {
          type: "template",
          label: t("Page Template"),
          roles: ["admin"]
        },
        {
          type: "showMembership",
          label: t("View as")
        },
        {
          type: "wpFeatureImage",
          label: t("Featured Image"),
          disabled: IS_TEMPLATE
        }
      ]
    },
    {
      id: "popover",
      icon: "nc-back",
      title: t("More"),
      type: "popover",
      options: [
        {
          type: "link",
          icon: "nc-unlock",
          label: t("Upgrade to Pro"),
          link: urls.upgradeToPro,
          linkTarget: "_blank",
          disabled: IS_PRO
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
          onClick: (e: MouseEvent): void => {
            e.preventDefault();

            Prompts.open({
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
  ]
};
