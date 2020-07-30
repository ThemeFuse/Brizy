import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import {
  toolbarBorderRadius,
  toolbarPaddingFourFieldsPxSuffix,
  toolbarShapeTopType,
  toolbarShapeTopFlip,
  toolbarShapeBottomType,
  toolbarShapeBottomFlip
} from "visual/utils/toolbar";

export const title = t("Header");

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: shapeTopColorHex } = getOptionColorHexByPalette(
    dvv("shapeTopColorHex"),
    dvv("shapeTopColorPalette")
  );

  const { hex: shapeBottomColorHex } = getOptionColorHexByPalette(
    dvv("shapeBottomColorHex"),
    dvv("shapeBottomColorPalette")
  );

  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            toolbarPaddingFourFieldsPxSuffix({
              v,
              device,
              state: "normal"
            }),
            toolbarBorderRadius({
              v,
              device,
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
              id: "shapeDividersGroup",
              type: "group-dev",
              options: [
                {
                  id: "shape",
                  label: t("Dividers"),
                  type: "radioGroup-dev",
                  choices: [
                    { value: "top", icon: "nc-dividers-top" },
                    { value: "bottom", icon: "nc-dividers-bottom" }
                  ]
                },
                {
                  id: "shapeTopDividersGroup",
                  type: "group-dev",
                  disabled: dvv("shape") !== "top",
                  options: [
                    toolbarShapeTopType({
                      v,
                      device,
                      state: "normal"
                    }),
                    {
                      id: "shapeTopColors",
                      type: "popover-dev",
                      label: t("Color"),
                      config: {
                        size: "auto",
                        title: t("Color"),
                        icon: {
                          style: {
                            backgroundColor: hexToRgba(
                              shapeTopColorHex,
                              dvv("shapeTopColorOpacity")
                            )
                          }
                        }
                      },
                      disabled: dvv("shapeTopType") === "none",
                      options: [
                        { id: "shapeTopColor", type: "colorPicker-dev" }
                      ]
                    },
                    {
                      id: "shapeTopHeight",
                      type: "slider-dev",
                      icon: "nc-height",
                      disabled: dvv("shapeTopType") === "none",
                      config: {
                        min: 0,
                        max: dvv("shapeTopHeightSuffix") === "px" ? 500 : 100,
                        units: [
                          { title: "px", value: "px" },
                          { title: "%", value: "%" }
                        ]
                      }
                    },
                    toolbarShapeTopFlip({
                      v,
                      device,
                      disabled: dvv("shapeTopType") === "none",
                      state: "normal"
                    }),
                    {
                      id: "shapeTopIndex",
                      type: "radioGroup-dev",
                      label: t("Arrangement"),
                      disabled: dvv("shapeTopType") === "none",
                      choices: [
                        { value: "auto", icon: "nc-send-to-back" },
                        { value: "10", icon: "nc-bring-to-top" }
                      ]
                    }
                  ]
                },
                {
                  id: "shapeBottomDividersGroup",
                  type: "group-dev",
                  disabled: dvv("shape") !== "bottom",
                  options: [
                    toolbarShapeBottomType({
                      v,
                      device,
                      state: "normal"
                    }),
                    {
                      id: "shapeBottomColors",
                      type: "popover-dev",
                      label: t("Color"),
                      config: {
                        size: "auto",
                        title: t("Color"),
                        icon: {
                          style: {
                            backgroundColor: hexToRgba(
                              shapeBottomColorHex,
                              dvv("shapeBottomColorOpacity")
                            )
                          }
                        }
                      },
                      disabled: dvv("shapeBottomType") === "none",
                      options: [
                        { id: "shapeBottomColor", type: "colorPicker-dev" }
                      ]
                    },
                    {
                      id: "shapeBottomHeight",
                      type: "slider-dev",
                      icon: "nc-height",
                      disabled: dvv("shapeBottomType") === "none",
                      config: {
                        min: 0,
                        max:
                          dvv("shapeBottomHeightSuffix") === "px" ? 500 : 100,
                        units: [
                          { title: "px", value: "px" },
                          { title: "%", value: "%" }
                        ]
                      }
                    },
                    toolbarShapeBottomFlip({
                      v,
                      device,
                      disabled: dvv("shapeBottomType") === "none",
                      state: "normal"
                    }),
                    {
                      id: "shapeBottomIndex",
                      type: "radioGroup-dev",
                      label: t("Arrangement"),
                      disabled: dvv("shapeBottomType") === "none",
                      choices: [
                        { value: "auto", icon: "nc-send-to-back" },
                        { value: "10", icon: "nc-bring-to-top" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          icon: "nc-cog",
          devices: "desktop",
          options: [
            {
              id: "hoverTransition",
              label: t("Hover Transition"),
              devices: "desktop",
              position: 100,
              type: "slider-dev",
              config: {
                min: 0,
                max: 99,
                units: [{ title: "ms", value: "ms" }]
              }
            }
          ]
        }
      ]
    }
  ];
}
