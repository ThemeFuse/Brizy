import { t } from "visual/utils/i18n";
import {
  toolbarBorderRadius,
  toolbarPaddingFourFieldsPxSuffix
} from "visual/utils/toolbar";

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

export function getItems({ v, device }) {
  return [
    toolbarPaddingFourFieldsPxSuffix({
      v,
      device,
      prefix: "filter",
      state: "normal",
      onChangeGrouped: ["onChangePaddingGrouped"],
      onChangeUngrouped: ["onChangePaddingUngrouped"]
    }),
    toolbarBorderRadius({
      v,
      device,
      prefix: "filter",
      state: "normal",
      onChangeGrouped: ["onChangeBorderRadiusGrouped"],
      onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
    })
  ];
}
