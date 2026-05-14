import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "WOOSaleBadge",
    title: t("Sale Badge"),
    icon: "nc-woo-sale-badge",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--WOOSaleBadge"],
        items: [
          {
            type: "WOOSaleBadge"
          }
        ]
      }
    }
  };
}
