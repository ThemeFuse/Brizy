import { t } from "visual/utils/i18n";
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
      position: 70,
      choices: getAnimationsTabs()
    }),
    {
      id: "tagName",
      label: t("HTML Tag"),
      type: "select-dev",
      choices: [
        { title: t("SPAN"), value: "span" },
        { title: t("DIV"), value: "div" },
        { title: t("P"), value: "p" },
        { title: t("H1"), value: "h1" },
        { title: t("H2"), value: "h2" },
        { title: t("H3"), value: "h3" },
        { title: t("H4"), value: "h4" },
        { title: t("H5"), value: "h5" },
        { title: t("H6"), value: "h6" },
        { title: t("PRE"), value: "pre" }
      ]
    }
  ];
}
