import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "ProductMetafield",
    title: t("Metafield"),
    icon: "t2-shopify-metafield",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.ProductMetafield,
            value: {
              ...config?.contentDefaults?.[ElementTypes.ProductMetafield]
            }
          }
        ]
      }
    }
  };
}
