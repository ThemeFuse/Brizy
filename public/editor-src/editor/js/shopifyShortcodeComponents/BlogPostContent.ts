import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "BlogDescription",
    title: t("Description"),
    icon: "nc-wp-post-content",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: "WPPostContent",
            value: {
              _styles: ["WPPostContent", "BlogPostContent"],
              ...config.contentDefaults?.[ElementTypes.BlogDescription]
            }
          }
        ]
      }
    }
  };
}
