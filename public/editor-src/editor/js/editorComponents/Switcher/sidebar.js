import { t } from "visual/utils/i18n";
import {
  toolbarBorderRadius,
  toolbarEntranceAnimation,
  toolbarPaddingFourFieldsPxSuffix
} from "visual/utils/toolbar";

export const title = t("Switcher Tabs");

export function getItems({ v, device }) {
  return [
    toolbarPaddingFourFieldsPxSuffix({
      v,
      device,
      disabled: v.switcherStyle === "style-2",
      state: "normal",
      onChangeGrouped: ["onChangePaddingGrouped"],
      onChangeUngrouped: ["onChangePaddingUngrouped"]
    }),
    toolbarBorderRadius({
      v,
      device,
      state: "normal",
      onChangeGrouped: ["onChangeBorderRadiusGrouped"],
      onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
    }),
    toolbarEntranceAnimation({ v, device })
  ];
}
