import Config from "visual/global/Config";
import UIState from "visual/global/UIState";
import { AddElements } from "./components/AddElements";
import { BlocksSortable } from "./components/BlocksSortable";
import { Styling } from "./components/Styling";
import { DeviceModes } from "./components/DeviceModes";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP } from "visual/utils/models";

const urls = Config.get("urls");
const wp = Config.get("wp");
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
          disabled: wp.isTemplate
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
          linkTarget: "_blank",
          label: t("Upgrade to Pro"),
          link: urls.upgradeToPro,
          disabled: proEnabled
        },
        {
          type: "link",
          icon: "nc-bug",
          linkTarget: "_blank",
          label: t("Submit an Issue"),
          link: urls.support,
          roles: ["admin"]
        },
        {
          type: "link",
          icon: "nc-info",
          linkTarget: "_blank",
          label: t("About Brizy"),
          link: urls.about
        },
        {
          type: "link",
          icon: "nc-alert-circle-que",
          label: t("Shortcuts"),
          link: "#",
          onClick: e => {
            e.preventDefault();

            UIState.set("prompt", {
              prompt: "key-helper"
            });
          }
        },
        {
          type: "link",
          icon: "nc-cog",
          linkTarget: "_blank",
          label: t("Plugin Settings"),
          link: urls.pluginSettings,
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
