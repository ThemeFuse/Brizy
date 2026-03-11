import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Product",
    title: t("Product"),
    upgradeMessage: t("You need the Shop Add-on to use this"),
    upgradeActionMessage: t("Get Shop Add-On"),
    icon: "nc-woo-related-products",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ecwid-product"],
        items: [
          {
            type: ElementTypes.EcwidProduct,
            value: { _styles: ["product"] }
          }
        ]
      }
    }
  };
}
