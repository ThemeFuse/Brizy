import Config from "visual/global/Config";
import Prompts from "visual/component/Prompts";
import { AddElements } from "./components/AddElements";
import { BlocksSortable } from "./components/BlocksSortable";
import { Styling } from "./components/Styling";
import { DeviceModes } from "./components/DeviceModes";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP, IS_TEMPLATE } from "visual/utils/models";

const urls = Config.get("urls");
const proEnabled = Boolean(Config.get("pro"));

export default {
  top: [AddElements, BlocksSortable, Styling],
  bottom: [
    DeviceModes,
    {
      id: "popover",
      icon: "nc-page",
      title: t("Page"),
      type: "popover",
      disabled: IS_GLOBAL_POPUP,
      options: [
        {
          type: "wpTemplate",
          label: t("Page Template"),
          roles: ["admin"]
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
      icon: "nc-menu",
      title: t("More"),
      type: "popover",
      options: [
        {
          type: "link",
          icon: "nc-unlock",
          label: t("Upgrade to Pro"),
          link: urls.upgradeToPro,
          linkTarget: "_blank",
          disabled: proEnabled
        },
        {
          type: "link",
          icon: "nc-info",
          label: t("About Brizy"),
          link: urls.about,
          linkTarget: "_blank"
        },
        {
          type: "link",
          icon: "nc-help-docs",
          label: t("Support & Docs"),
          link: urls.support,
          linkTarget: "_blank",
          roles: ["admin"]
        },
        {
          type: "link",
          icon: "nc-alert-circle-que",
          label: t("Shortcuts"),
          link: "#",
          onClick: e => {
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
