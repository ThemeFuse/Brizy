import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "Product Variant",
    title: t("Variant"),
    icon: "t2-shopify-variant",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.Variant,
            value: {
              ...config.contentDefaults?.[ElementTypes.Variant]
            }
          }
        ]
      }
    }
  };
}
