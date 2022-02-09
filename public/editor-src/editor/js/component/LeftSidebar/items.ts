import { MouseEvent } from "react";
import Config from "visual/global/Config";
import Prompts from "visual/component/Prompts";
import { t } from "visual/utils/i18n";
import {
  IS_EXTERNAL_POPUP,
  IS_EXTERNAL_STORY,
  IS_GLOBAL_POPUP,
  IS_STORY
} from "visual/utils/models";
import { Base, Shopify } from "./components/AddElements";
import { BlocksSortable } from "./components/BlocksSortable";
import { Styling } from "./components/Styling";
import { DeviceModes } from "./components/DeviceModes";
import { Cms } from "./components/Cms";
import { Settings } from "./components/Settings";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";

const config = Config.getAll();
const urls = config.urls;

export default {
  top: [
    ...(!IS_EXTERNAL_STORY && !IS_EXTERNAL_POPUP ? [Cms] : []),
    Base,
    ...(isCloud(config) && isShopify(config) ? [Shopify] : []),
    BlocksSortable,
    ...(isCloud(config) && isShopify(config) ? [] : [Styling])
  ],
  bottom: [
    DeviceModes,
    ...(IS_EXTERNAL_STORY ? [Settings] : []),
    {
      id: "popover",
      icon: "nc-page",
      title: t("Page"),
      type: "popover",
      disabled: IS_GLOBAL_POPUP || IS_STORY,
      options: [
        {
          type: "showMembership",
          label: t("View as")
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
          icon: "nc-back",
          disabled: isCloud(config) && isShopify(config),
          label: t("Go to Dashboard"),
          link: urls.backToDashboard
        }
      ]
    }
  ]
};
