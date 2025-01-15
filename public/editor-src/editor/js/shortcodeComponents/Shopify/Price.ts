import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "Price",
    title: t("Price"),
    icon: "nc-woo-price",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.Price,
            value: {
              ...config?.contentDefaults?.[ElementTypes.Price]
            }
          }
        ]
      }
    }
  };
}
