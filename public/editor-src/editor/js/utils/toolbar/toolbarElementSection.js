import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { toolbarColor2, toolbarColorHexField2 } from "./toolbarColor";

export function toolbarElementSectionBoxShadow({ v, device, state, onChange }) {
  const boxShadowBlurValue = defaultValueValue({
    v,
    key: "boxShadowBlur",
    device,
    state
  });

  const boxShadowVerticalValue = defaultValueValue({
    v,
    key: "boxShadowVertical",
    device,
    state
  });

  return {
    id: defaultValueKey({ key: "boxShadow", device, state }),
    type: "multiInput",
    config: {
      defaultIcon: ["nc-shadow"],
      icons: ["nc-blur", "nc-vertical"]
    },
    value: [boxShadowBlurValue, boxShadowVerticalValue],
    onChange: ([boxShadowBlur, boxShadowVertical]) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{
          boxShadowBlur,
          boxShadowVertical
        }
      };

      return saveOnChanges(values);
    }
  };
}
export function toolbarElementSectionSaved({
  device,
  component,
  position = 90,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("makeItSaved"),
    type: "buttonTooltip",
    icon: "nc-save-section",
    devices,
    position,
    title: t("Save"),
    tooltipContent: t("Saved"),
    onChange: () => {
      component.becomeSaved();
    }
  };
}

function toolbarElementSectionColumnsHeightStyle({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("fullHeight"),
    label: t("Height"),
    type: "select",
    devices,
    disabled,
    choices: [
      {
        title: t("Auto"),
        value: "off"
      },
      {
        title: t("Custom"),
        value: "custom"
      },
      {
        title: t("Full Height"),
        value: "on"
      }
    ],
    value: dvv("fullHeight")
  };
}

function toolbarElementSectionColumnsCustomHeightStyle({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const sectionHeightSuffix = dvv("sectionHeightSuffix");

  return {
    id: dvk("sectionHeight"),
    devices,
    disabled,
    type: "slider",
    slider: {
      min: 20,
      max: sectionHeightSuffix === "px" ? 500 : 100
    },
    input: {
      show: true,
      min: 0
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        },
        {
          title: "%",
          value: "vh"
        }
      ]
    },
    value: {
      value: dvv("sectionHeight"),
      suffix: sectionHeightSuffix
    },
    onChange: ({ value: sectionHeight, suffix: sectionHeightSuffix }) => ({
      sectionHeight,
      sectionHeightSuffix
    })
  };
}

export function toolbarElementSectionHeightStyle({
  v,
  device,
  state,
  devices = "all",
  position = 100,
  disabled = false
}) {
  return {
    id: "toolbarContainerTypeAndHeight",
    type: "multiPicker",
    devices,
    position,
    disabled,
    picker: toolbarElementSectionColumnsHeightStyle({
      v,
      device,
      state
    }),
    choices: {
      custom: [
        toolbarElementSectionColumnsCustomHeightStyle({
          v,
          device,
          state
        })
      ]
    }
  };
}

export function toolbarElementSectionSlider({
  v,
  component,
  devices = "all",
  device,
  state
}) {
  const getSliderTabs = ({ v, component, devices, device, state }) => {
    const dvv = key => defaultValueValue({ v, key, device, state });
    const dvk = key => defaultValueKey({ key, device, state });

    const slider = dvv("slider");

    let tabs = [
      {
        id: dvk("sliderOption1"),
        label: t("Block"),
        devices,
        options: [
          toolbarElementSectionGlobal({ device, devices, component, state }),
          {
            id: dvk("slider"),
            label: t("Make it a Slider"),
            type: "switch",
            value: slider
          }
          // {
          //   id: "sliderAnimation",
          //   label: t("Entrance Animation"),
          //   type: "radioGroup",
          //   disabled: slider === "off",
          //   choices: [
          //     {
          //       icon: "nc-slider-horizontal",
          //       value: "none"
          //     },
          //     {
          //       icon: "nc-slider-vertical",
          //       value: "vertical"
          //     },
          //     {
          //       icon: "nc-fade",
          //       value: "fade"
          //     }
          //   ],
          //   value: v.sliderAnimation,
          //   onChange: sliderAnimation => {
          //     hideToolbar();

          //     return {
          //       sliderAnimation
          //     };
          //   }
          // }
        ]
      }
    ];

    if (slider === "on") {
      tabs.push({
        id: dvk("sliderOption2"),
        label: t("Slider"),
        options: [
          {
            type: "multiPicker",
            picker: {
              id: dvk("sliderAutoPlay"),
              label: t("Auto Play"),
              type: "switch",
              value: dvv("sliderAutoPlay")
            },
            choices: {
              on: [
                {
                  id: dvk("sliderAutoPlaySpeed"),
                  label: t("Speed"),
                  type: "slider",
                  slider: {
                    min: 1,
                    max: 6
                  },
                  input: {
                    show: true
                  },
                  suffix: {
                    show: true,
                    choices: [
                      {
                        title: "s",
                        value: "s"
                      }
                    ]
                  },
                  value: {
                    value: dvv("sliderAutoPlaySpeed")
                  },
                  onChange: ({ value: sliderAutoPlaySpeed }) => ({
                    sliderAutoPlaySpeed
                  })
                }
              ]
            }
          },
          {
            id: dvk("sliderDots"),
            label: t("Dots"),
            type: "select",
            choices: [
              {
                title: t("None"),
                icon: "nc-none",
                value: "none"
              },
              {
                title: t("Circle"),
                icon: "nc-circle-outline",
                value: "circle"
              },
              {
                title: t("Diamond"),
                icon: "nc-diamond-outline",
                value: "diamond"
              },
              {
                title: t("Square"),
                icon: "nc-square-outline",
                value: "square"
              }
            ],
            value: dvv("sliderDots")
          },
          {
            id: dvk("sliderArrows"),
            label: t("Arrows"),
            type: "select",
            choices: [
              {
                title: t("None"),
                icon: "nc-none",
                value: "none"
              },
              {
                title: t("Thin"),
                icon: "nc-right-arrow-thin",
                value: "thin"
              },
              {
                title: t("Heavy"),
                icon: "nc-right-arrow-heavy",
                value: "heavy"
              },
              {
                title: t("Tail"),
                icon: "nc-right-arrow-tail",
                value: "tail"
              },
              {
                title: t("Round"),
                icon: "nc-right-arrow-filled",
                value: "filled"
              },
              {
                title: t("Outline"),
                icon: "nc-right-arrow-outline",
                value: "outline"
              }
            ],
            value: dvv("sliderArrows")
          }
        ]
      });
    }

    return tabs;
  };
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("toolbarSlider"),
    type: "popover",
    icon: "nc-block-switch",
    title: t("Block"),
    position: 70,
    devices,
    options: [
      {
        id: "sliders",
        type: "tabs",
        tabs: getSliderTabs({ v, component, devices, device, state })
      }
    ]
  };
}

export function toolbarElementSectionSliderColor({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  const slider = dvv("slider");

  return {
    id: dvk("tabsColor"),
    type: "tabs",
    devices,
    tabs:
      slider === "off"
        ? []
        : [
            {
              id: dvk("dots"),
              label: t("Dots"),
              devices,
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  devices,
                  disabled: slider === "off",
                  prefix: "sliderDotsColor",
                  onChangeHex: [
                    "onChangeColorHexAndOpacity",
                    "onChangeColorHexAndOpacityPalette"
                  ],
                  onChangePalette: [
                    "onChangeColorPalette",
                    "onChangeColorPaletteOpacity"
                  ]
                }),
                {
                  type: "grid",
                  disabled: slider === "off",
                  className: "brz-ed-grid__color-fileds",
                  devices,
                  columns: [
                    {
                      width: 100,
                      options: [
                        toolbarColorHexField2({
                          v,
                          device,
                          state,
                          devices,
                          prefix: "sliderDotsColor",
                          onChange: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: dvk("arrows"),
              label: t("Arrows"),
              devices,
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  devices,
                  disabled: slider === "off",
                  prefix: "sliderArrowsColor",
                  onChangeHex: [
                    "onChangeColorHexAndOpacity",
                    "onChangeColorHexAndOpacityPalette"
                  ],
                  onChangePalette: [
                    "onChangeColorPalette",
                    "onChangeColorPaletteOpacity"
                  ]
                }),
                {
                  type: "grid",
                  disabled: slider === "off",
                  devices,
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
                      options: [
                        toolbarColorHexField2({
                          v,
                          device,
                          state,
                          devices,
                          prefix: "sliderArrowsColor",
                          onChange: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            }
          ]
  };
}

export function toolbarElementSectionGlobal({
  device,
  devices = "all",
  component,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("makeItGlobal"),
    label: t("Make it Global"),
    type: "switch",
    devices,
    value: component.props.meta.globalBlockId ? "on" : "off",
    onChange: value => {
      value === "on" ? component.becomeGlobal() : component.becomeNormal();
    }
  };
}

export function toolbarElementSectionHeaderType({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("type"),
    label: t("Header"),
    type: "select",
    devices,
    choices: [
      {
        title: t("Static"),
        value: "static"
      },
      {
        title: t("Fixed"),
        value: "fixed"
      },
      {
        title: t("Sticky"),
        value: "animated"
      }
    ],
    value: dvv("type")
  };
}
