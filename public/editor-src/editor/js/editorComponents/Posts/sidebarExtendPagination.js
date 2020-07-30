import { t } from "visual/utils/i18n";
import { toolbarBorderRadius } from "visual/utils/toolbar";

export const title = t("Posts Pagination");

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
