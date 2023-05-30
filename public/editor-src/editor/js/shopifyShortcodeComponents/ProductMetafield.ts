import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "ProductMetafield",
    title: t("Metafield"),
    icon: "nc-wp-post-title",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.ProductMetafield,
            value: {
              sourceType: "shopify-product",
              ...config?.contentDefaults?.[ElementTypes.ProductMetafield]
            }
          }
        ]
      }
    }
  };
}
