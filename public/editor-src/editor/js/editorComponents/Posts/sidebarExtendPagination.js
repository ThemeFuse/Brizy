import { t } from "visual/utils/i18n";
import { toolbarBorderRadius } from "visual/utils/toolbar";

export const title = ({ v }) => {
  switch (v.type) {
    case "posts":
      return t("Posts Pagination");
    case "relatedProducts":
      return t("Related Products Pagination");
    case "upsell":
      return t("Upsell Pagination");
    case "products":
      return t("Products Pagination");
    case "categories":
      return t("Categories Pagination");
    default:
      return t("Posts Pagination");
  }
};

export function getItems({ v, device }) {
  return [
    toolbarBorderRadius({
      v,
      device,
      state: "normal",
      prefix: "pagination",
      devices: "desktop",
      onChangeGrouped: ["onChangeBorderRadiusGrouped"],
      onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
    })
  ];
}
