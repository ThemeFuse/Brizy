import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarBorderRadius,
  toolbarHoverTransition,
  toolbarPaddingFourFieldsPxSuffix,
  toolbarShape,
  toolbarShapeTopType,
  toolbarShapeTopColor,
  toolbarShapeTopHeight,
  toolbarShapeTopFlip,
  toolbarShapeTopIndex,
  toolbarShapeBottomType,
  toolbarShapeBottomColor,
  toolbarShapeBottomHeight,
  toolbarShapeBottomFlip,
  toolbarShapeBottomIndex
} from "visual/utils/toolbar";

export const title = t("Header");

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  return [
    {
      id: dvk("settingsTabs"),
      type: "tabs",
      align: "start",
      tabs: [
        {
          id: dvk("settingsStyling"),
          label: t("Styling"),
          tabIcon: "nc-styling",
          options: [
            toolbarPaddingFourFieldsPxSuffix({
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
            {
              type: "multiPicker",
              picker: toolbarShape({
                v,
                device,
                state: "normal"
              }),
              disabled:
                device !== "desktop"
                  ? dvv("shapeTopType") === "none" &&
                    dvv("shapeBottomType") === "none"
                  : false,
              choices: {
                top: [
                  toolbarShapeTopType({
                    v,
                    device,
                    devices: "desktop",
                    state: "normal"
                  }),
                  toolbarShapeTopColor({
                    v,
                    device,
                    disabled: dvv("shapeTopType") === "none",
                    devices: "desktop",
                    state: "normal"
                  }),
                  toolbarShapeTopHeight({
                    v,
                    device,
                    disabled: dvv("shapeTopType") === "none",
                    state: "normal"
                  }),
                  toolbarShapeTopFlip({
                    v,
                    device,
                    disabled: dvv("shapeTopType") === "none",
                    devices: "desktop",
                    state: "normal"
                  }),
                  toolbarShapeTopIndex({
                    v,
                    device,
                    disabled: dvv("shapeTopType") === "none",
                    devices: "desktop",
                    state: "normal"
                  })
                ],
                bottom: [
                  toolbarShapeBottomType({
                    v,
                    device,
                    devices: "desktop",
                    state: "normal"
                  }),
                  toolbarShapeBottomColor({
                    v,
                    device,
                    disabled: dvv("shapeBottomType") === "none",
                    devices: "desktop",
                    state: "normal"
                  }),
                  toolbarShapeBottomHeight({
                    v,
                    device,
                    disabled: dvv("shapeBottomType") === "none",
                    state: "normal"
                  }),
                  toolbarShapeBottomFlip({
                    v,
                    device,
                    disabled: dvv("shapeBottomType") === "none",
                    devices: "desktop",
                    state: "normal"
                  }),
                  toolbarShapeBottomIndex({
                    v,
                    device,
                    disabled: dvv("shapeBottomType") === "none",
                    devices: "desktop",
                    state: "normal"
                  })
                ]
              }
            }
          ]
        },
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          tabIcon: "nc-cog",
          devices: "desktop",
          options: [
            toolbarHoverTransition({
              v,
              device,
              state: "normal",
              devices: "desktop"
            })
          ]
        }
      ]
    }
  ];
}
