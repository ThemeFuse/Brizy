import { t } from "visual/utils/i18n";
import {
  toolbarColor2,
  toolbarColorHexField2,
  toolbarShowOnDesktop,
  toolbarShowOnTablet,
  toolbarShowOnMobile,
  toolbarZIndex,
  toolbarCustomCSSClass
} from "visual/utils/toolbar";

const getSliderTabs = (v, component) => {
  const { slider } = v;

  let tabs = [
    {
      id: "sliderOption1",
      label: t("Block"),
      options: [
        {
          id: "makeItGlobal",
          label: t("Make it Global"),
          type: "switch",
          value: component.props.meta.globalBlockId ? "on" : "off",
          onChange: value => {
            value === "on"
              ? component.becomeGlobal()
              : component.becomeNormal();
          }
        },
        {
          id: "slider",
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
      id: "sliderOption2",
      label: t("Slider"),
      options: [
        {
          type: "multiPicker",
          picker: {
            id: "sliderAutoPlay",
            label: t("Auto Play"),
            type: "switch",
            value: v.sliderAutoPlay
          },
          choices: {
            on: [
              {
                id: "sliderAutoPlaySpeed",
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
                  value: v.sliderAutoPlaySpeed
                },
                onChange: ({ value: sliderAutoPlaySpeed }) => ({
                  sliderAutoPlaySpeed
                })
              }
            ]
          }
        },
        {
          id: "sliderDots",
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
          value: v.sliderDots
        },
        {
          id: "sliderArrows",
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
          value: v.sliderArrows
        }
      ]
    });
  }

  return tabs;
};

const getSliderColorsTabs = ({ v, device, state }) => {
  if (v.slider === "off") return [];

  return [
    {
      id: "dots",
      label: t("Dots"),
      options: [
        toolbarColor2({
          v,
          device,
          state,
          disabled: v.slider === "off",
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
          disabled: v.slider === "off",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                toolbarColorHexField2({
                  v,
                  device,
                  state,
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
      id: "arrows",
      label: t("Arrows"),
      options: [
        toolbarColor2({
          v,
          device,
          state,
          disabled: v.slider === "off",
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
          disabled: v.slider === "off",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                toolbarColorHexField2({
                  v,
                  device,
                  state,
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
  ];
};

export function getItemsForDesktop(v, component) {
  const device = "desktop";

  return [
    {
      id: "toolbarSlider",
      type: "popover",
      icon: "nc-block-switch",
      title: t("Block"),
      position: 70,
      options: [
        {
          id: "sliders",
          type: "tabs",
          tabs: getSliderTabs(v, component)
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      position: 90,
      options: [
        {
          id: "tabsState",
          tabsPosition: "left",
          type: "tabs",
          value: v.tabsState,
          tabs: [
            {
              id: "tabNormal",
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  tabs: getSliderColorsTabs({ v, device, state: "normal" })
                }
              ]
            },
            {
              id: "tabHover",
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  tabs: getSliderColorsTabs({ v, device, state: "hover" })
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "makeItSaved",
      type: "buttonTooltip",
      icon: "nc-save-section",
      position: 100,
      title: t("Save"),
      tooltipContent: t("Saved"),
      onChange: () => {
        component.becomeSaved();
      }
    },
    {
      id: "toolbarSettings",
      type: "popover",
      position: 110,
      options: [
        {
          id: "fullHeight",
          label: t("Full Height"),
          type: "switch",
          value: v.fullHeight,
          position: 20
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    toolbarShowOnDesktop({ v }),
                    toolbarZIndex({ v }),
                    {
                      id: "anchorName",
                      label: t("Anchor Name"),
                      type: "input",
                      display: "block",
                      position: 30,
                      value: {
                        value: v.anchorName
                      },
                      onChange: ({ value: anchorName }) => ({
                        anchorName
                      })
                    },
                    toolbarCustomCSSClass({ v })
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  return [toolbarShowOnTablet({ v })];
}

export function getItemsForMobile(v) {
  return [toolbarShowOnMobile({ v })];
}
