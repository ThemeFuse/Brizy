import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { capitalize } from "visual/utils/string";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: closeColorHex } = getOptionColorHexByPalette(
    dvv("closeColorHex"),
    dvv("closeColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "toolbarCurrentElementTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "toolbarCurrentElementTabClose",
              label: t("Icon"),
              options: [
                {
                  id: "closeHorizontalPosition",
                  label: t("Lateral"),
                  type: "slider-dev",
                  config: {
                    min: -50,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "closeVerticalPosition",
                  label: t("Vertical"),
                  type: "slider-dev",
                  config: {
                    min: -50,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "groupCloseSize",
                  type: "group-dev",
                  options: [
                    {
                      id: dvk("closeSize"),
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: dvv("closeSize"),
                      onChange: value => {
                        return {
                          [dvk("closeSize")]: value,
                          [dvk("closeCustomSize")]:
                            value !== "custom"
                              ? dvv(`close${capitalize(value)}Size`)
                              : dvv("closeCustomSize")
                        };
                      }
                    },
                    {
                      id: "closeCustomSize",
                      type: "slider-dev",
                      disabled: dvv("closeSize") !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "toolbarCurrentElementTabBackground",
              label: t("Background"),
              options: [
                {
                  id: "closeBgSize",
                  label: t("Size"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 30,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "groupCloseBorderRadiusShape",
                  type: "group-dev",
                  options: [
                    {
                      id: dvk("closeBorderRadiusShape"),
                      label: t("Corner"),
                      type: "radioGroup",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: dvv("closeBorderRadiusShape"),
                      onChange: value => {
                        return {
                          [dvk("closeBorderRadiusShape")]: value,
                          [dvk("tempCloseBorderRadiusShape")]:
                            value !== ""
                              ? value
                              : defaultValueValue("tempCloseBorderRadiusShape"),
                          [dvk("closeBorderRadius")]:
                            value === "rounded"
                              ? 50
                              : dvv("tempCloseBorderRadius")
                        };
                      }
                    },
                    {
                      id: "closeBorderRadius",
                      type: "slider-dev",
                      disabled: dvv("closeBorderRadiusShape") !== "custom",
                      config: {
                        min: 0,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(closeColorHex, dvv("closeColorOpacity"))
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "closeColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "closeBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "closePosition",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-position-in", value: "inside" },
        { icon: "nc-position-out", value: "outside" }
      ]
    },
    {
      id: "closeAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-align-top-left", value: "topLeft" },
        { icon: "nc-align-top-right", value: "topRight" },
        { icon: "nc-align-bottom-right", value: "bottomRight" },
        { icon: "nc-align-bottom-left", value: "bottomLeft" }
      ]
    }
  ];
}
