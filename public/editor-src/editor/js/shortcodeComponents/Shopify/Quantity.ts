import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "ProductQuantity",
    title: t("Quantity"),
    icon: "t2-shopify-quantity",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.Quantity,
            value: {
              ...config?.contentDefaults?.[ElementTypes.Quantity]
            }
          }
        ]
      }
    }
  };
}
