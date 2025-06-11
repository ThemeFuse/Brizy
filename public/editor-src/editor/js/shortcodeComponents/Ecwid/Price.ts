import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "EcwidPrice",
    title: t("Price"),
    icon: "nc-woo-price",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.EcwidPrice
          }
        ]
      }
    }
  };
}
