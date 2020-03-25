import {
  toolbarBorderRadius,
  toolbarPaddingFourFields
} from "visual/utils/toolbar";

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
      devices: "desktop",
      onChangeGrouped: [
        "onChangeBorderRadiusGrouped",
        "onChangeBorderRadiusGroupedDependencies"
      ],
      onChangeUngrouped: [
        "onChangeBorderRadiusUngrouped",
        "onChangeBorderRadiusUngroupedDependencies"
      ]
    })
  ];
}
