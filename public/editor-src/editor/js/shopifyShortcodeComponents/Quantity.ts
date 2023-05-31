import {
  ConfigCommon,
  ElementTypes
} from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "ProductQuantity",
    title: t("Quantity"),
    icon: "nc-cog",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-quantity"],
        items: [
          {
            type: ElementTypes.Quantity,
            value: {
              sourceType: "shopify-product",
              ...config?.contentDefaults?.[ElementTypes.Quantity]
            }
          }
        ]
      }
    }
  };
}
