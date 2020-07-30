import { t } from "visual/utils/i18n";
import {
  toolbarEntranceAnimation,
  toolbarPaddingFourFields
} from "visual/utils/toolbar";
import { getAnimationsTabs } from "visual/utils/options/getAnimations";

export const title = t("Tabs Items");

export function getItems({ v, device }) {
  return [
    toolbarPaddingFourFields({
      v,
      device,
      state: "normal",
      onChangeGrouped: ["onChangePaddingGrouped"],
      onChangeUngrouped: ["onChangePaddingUngrouped"]
    }),
    toolbarEntranceAnimation({
      v,
      device,
      choices: getAnimationsTabs()
    })
  ];
}
