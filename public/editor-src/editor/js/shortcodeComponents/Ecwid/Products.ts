import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Products",
    title: t("Products"),
    upgradeMessage: t("You need the Shop Add-on to use this"),
    upgradeActionMessage: t("Get Shop Add-On"),
    icon: "nc-woo-products",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ecwid-products"],
        items: [
          {
            type: ElementTypes.EcwidProducts,
            value: { _styles: ["products"] }
          }
        ]
      }
    }
  };
}
