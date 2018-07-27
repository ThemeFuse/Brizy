import Config from "visual/global/Config";
import { AddElements } from "./components/AddElements";
import { BlocksSortable } from "./components/BlocksSortable";
import { Styling } from "./components/Styling";
import { DeviceModes } from "./components/DeviceModes";
import { t } from "visual/utils/i18n";

let urls = Config.get("urls");

export default {
  top: [AddElements, BlocksSortable, Styling],
  bottom: [
    DeviceModes,
    {
      id: "popover",
      icon: "nc-menu",
      title: t("More"),
      type: "popover",
      options: [
        {
          type: "wpTemplate",
          label: t("Page Template"),
          roles: ["admin"]
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
