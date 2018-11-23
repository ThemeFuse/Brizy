import Config from "visual/global/Config";
import { AddElements } from "./components/AddElements";
import { BlocksSortable } from "./components/BlocksSortable";
import { Styling } from "./components/Styling";
import { DeviceModes } from "./components/DeviceModes";
import { t } from "visual/utils/i18n";

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
          link: "https://github.com/ThemeFuse/Brizy/issues"
        },
        {
          type: "link",
          icon: "nc-info",
          linkTarget: "_blank",
          label: t("About Brizy"),
          link: "https://brizy.io"
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
          label: t("Back to WordPress"),
          link: urls.backToWordpress
        }
      ]
    }
  ]
};
