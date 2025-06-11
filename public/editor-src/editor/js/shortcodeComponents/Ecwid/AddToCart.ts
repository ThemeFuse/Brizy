import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "EcwidAddToCart",
    title: t("Add to Cart"),
    upgradeMessage: t("You need the Shop Add-on to use this"),
    upgradeActionMessage: t("Get Shop Add-On"),
    icon: "nc-woo-cart",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ecwid-addToCart"],
        items: [
          {
            type: ElementTypes.EcwidAddToCart
          }
        ]
      }
    }
  };
}
