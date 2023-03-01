import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export const title = ({ v, device }) => {
  const dvv = (key) => defaultValueValue({ v, key, device });
  const type = dvv("type");

  switch (type) {
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
