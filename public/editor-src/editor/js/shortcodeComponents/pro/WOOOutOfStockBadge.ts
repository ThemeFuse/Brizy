import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "WOOOutOfStockBadge",
    title: t("Out of Stock Badge"),
    icon: "nc-woo-out-of-stock-badge",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--WOOOutOfStockBadge"],
        items: [
          {
            type: "WOOOutOfStockBadge"
          }
        ]
      }
    }
  };
}
