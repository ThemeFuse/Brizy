import { t } from "visual/utils/i18n";
import {
  toolbarBorderRadius,
  toolbarPaddingFourFieldsPxSuffix
} from "visual/utils/toolbar";

export const title = t("Posts Tags");

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
