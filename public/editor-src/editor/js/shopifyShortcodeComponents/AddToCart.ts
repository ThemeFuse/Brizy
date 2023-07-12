import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "AddToCart",
    title: t("Add to cart"),
    icon: "nc-woo-add-to-cart",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-addToCart"],
        items: [
          {
            type: "AddToCart",
            value: {
              _styles: ["addToCart"],
              ...config.contentDefaults?.[ElementTypes.AddToCart]
            }
          }
        ]
      }
    }
  };
}
