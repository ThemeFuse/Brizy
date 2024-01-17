import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "ProductTitle",
    title: t("Title"),
    icon: "nc-wp-post-title",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-postTitle"],
        items: [
          {
            type: ElementTypes.PostTitle,
            value: {
              _styles: ["postTitle"],
              ...config.contentDefaults?.[ElementTypes.ShopifyTitle]
            }
          }
        ]
      }
    }
  };
}
