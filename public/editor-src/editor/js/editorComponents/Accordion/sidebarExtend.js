import {
  toolbarBorderRadius,
  toolbarEntranceAnimation,
  toolbarPaddingFourFields
} from "visual/utils/toolbar";
import { getAnimationsTabs } from "visual/utils/options/getAnimations";

export function getItems({ v, device }) {
  return [
    toolbarPaddingFourFields({
      v,
      device,
      state: "normal"
    }),
    toolbarBorderRadius({
      v,
      device,
      state: "normal",
      onChangeGrouped: [
        "onChangeBorderRadiusGrouped",
        "onChangeBorderRadiusGroupedDependencies"
      ],
      onChangeUngrouped: [
        "onChangeBorderRadiusUngrouped",
        "onChangeBorderRadiusUngroupedDependencies"
      ]
    }),
    toolbarEntranceAnimation({
      v,
      device,
      choices: getAnimationsTabs()
    })
  ];
}
