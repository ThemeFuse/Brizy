import { t } from "visual/utils/i18n";
import { toolbarPaddingFourFieldsPxSuffix } from "visual/utils/toolbar";

export const title = t("Timeline Items");

export function getItems({ v, device }) {
  return [
    toolbarPaddingFourFieldsPxSuffix({
      v,
      device,
      state: "normal"
    })
  ];
}
