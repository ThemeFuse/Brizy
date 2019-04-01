import UIState from "visual/global/UIState";
import { AddElements } from "./components/AddElements";
import { BlocksSortable } from "./components/BlocksSortable";
import { Styling } from "./components/Styling";
import { DeviceModes } from "./components/DeviceModes";
import { t } from "visual/utils/i18n";

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
          type: "link",
          icon: "nc-info",
          label: t("About Brizy"),
          link: "https://brizy.io",
          linkTarget: "_blank"
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
          icon: "nc-back",
          label: t("Back to Brizy"),
          link: "https://brizy.io",
          linkTarget: "_blank"
        }
      ]
    }
  ]
};
