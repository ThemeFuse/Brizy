import { t } from "visual/utils/i18n";

export const title = ({ v }) => {
  switch (v.type) {
    case "posts":
      return t("Posts Tags");
    case "relatedProducts":
      return t("Related Products Tags");
    case "upsell":
      return t("Upsell Tags");
    case "products":
      return t("Products Tags");
    case "categories":
      return t("Categories Tags");
    default:
      return t("Posts Tags");
  }
};

export function getItems() {
  return [
    {
      id: "filterPadding",
      type: "padding-dev",
      label: t("Padding"),
      position: 50,
      config: {
        units: ["px"]
      }
    },
    {
      id: "filterBorder",
      type: "corners-dev",
      label: t("Corner"),
      position: 65
    }
  ];
}
