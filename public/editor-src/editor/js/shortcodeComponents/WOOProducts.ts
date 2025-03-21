import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "WOOProducts",
    title: t("Products"),
    icon: "nc-woo-products",
    position: 20,
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--WOOProducts"],
        items: [
          {
            type: "WOOProducts"
          }
        ]
      }
    }
  };
}
