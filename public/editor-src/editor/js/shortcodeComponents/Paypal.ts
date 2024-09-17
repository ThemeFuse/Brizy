import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Paypal",
    title: t("Paypal"),
    icon: "t2-paypal",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: ElementTypes.Paypal
          }
        ]
      }
    }
  };
}
