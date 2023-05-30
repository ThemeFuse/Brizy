import {
  ConfigCommon,
  ElementTypes
} from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "Price",
    title: t("Price"),
    icon: "nc-woo-price",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-price"],
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
