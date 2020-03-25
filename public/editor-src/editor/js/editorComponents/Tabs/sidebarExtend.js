import { t } from "visual/utils/i18n";
import { toolbarPaddingFourFields } from "visual/utils/toolbar";

export const title = t("Tabs Items");

export function getItems({ v, device }) {
  return [
    toolbarPaddingFourFields({
      v,
      device,
      state: "normal",
      onChangeGrouped: ["onChangePaddingGrouped"],
      onChangeUngrouped: ["onChangePaddingUngrouped"]
    })
  ];
}
