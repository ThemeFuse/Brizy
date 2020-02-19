import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarBorderRadius,
  toolbarPaddingFourFieldsPxSuffix,
  toolbarHoverTransition,
  toolbarShowOnDesktop,
  toolbarAnchorName,
  toolbarCustomCSSClass,
  toolbarAttributes,
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
  toolbarShapeBottomIndex,
  toolbarTags
} from "visual/utils/toolbar";

export const title = t("Footer");

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

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
                devices: "desktop",
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
            toolbarShowOnDesktop({
              v,
              device,
              devices: "desktop",
              closeTooltip: true
            }),
            toolbarAnchorName({
              v,
              device,
              devices: "desktop",
              state: "normal",
              population: cssIDDynamicContentChoices
            }),
            toolbarCustomCSSClass({
              v,
              device,
              devices: "desktop",
              state: "normal",
              population: cssIDDynamicContentChoices
            }),

            toolbarAttributes({
              v,
              device,
              devices: "desktop",
              state: "normal"
            }),
            toolbarHoverTransition({
              v,
              position: 60,
              devices: "desktop"
            }),
            toolbarTags({
              v,
              device,
              devices: "desktop",
              state: "normal"
            })
          ]
        }
      ]
    }
  ];
}
