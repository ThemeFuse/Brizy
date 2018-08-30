import { hideToolbar } from "visual/component-new/Toolbar";
import { getOptionColor } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";

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
        //   label: t("Animation"),
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

const gitSliderColorsTabs = v => {
  if (v.slider === "off") return [];
  const { hex: sliderDotsColorHex } = getOptionColor(v, "sliderDotsColor");
  const { hex: sliderArrowsColorHex } = getOptionColor(v, "sliderArrowsColor");

  return [
    {
      id: "dots",
      label: t("Dots"),
      disabled: v.slider === "off",
      options: [
        {
          id: "sliderDotsColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: sliderDotsColorHex,
            opacity: v.sliderDotsColorOpacity
          },
          onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
            const sliderDotsColorOpacity =
              hex !== v.sliderDotsColorHex && v.sliderDotsColorOpacity === 0
                ? v.tempSliderDotsColorOpacity
                : opacity;

            return {
              sliderDotsColorHex: hex,
              sliderDotsColorOpacity: sliderDotsColorOpacity,
              sliderDotsColorPalette:
                isChanged === "hex" ? "" : v.sliderDotsColorPalette
            };
          }
        },
        {
          id: "sliderDotsColorPalette",
          type: "colorPalette",
          position: 20,
          value: v.sliderDotsColorPalette,
          onChange: sliderDotsColorPalette => ({
            sliderDotsColorPalette,

            sliderDotsColorOpacity:
              v.sliderDotsColorOpacity === 0
                ? v.tempSliderDotsColorOpacity
                : v.sliderDotsColorOpacity
          })
        },
        {
          id: "sliderDotsColorFields",
          type: "colorFields",
          position: 30,
          value: {
            hex: sliderDotsColorHex,
            opacity: v.sliderDotsColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => ({
            sliderDotsColorPalette:
              isChanged === "hex" ? "" : v.sliderDotsColorPalette,
            sliderDotsColorHex: hex,
            sliderDotsColorOpacity: opacity
          })
        }
      ]
    },
    {
      id: "arrows",
      label: t("Arrows"),
      disabled: v.slider === "off",
      options: [
        {
          id: "sliderArrowsColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: sliderArrowsColorHex,
            opacity: v.sliderArrowsColorOpacity
          },
          onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
            const sliderArrowsColorOpacity =
              hex !== v.sliderArrowsColorHex && v.sliderArrowsColorOpacity === 0
                ? v.tempSliderArrowsColorOpacity
                : opacity;

            return {
              sliderArrowsColorHex: hex,
              sliderArrowsColorOpacity: sliderArrowsColorOpacity,
              sliderArrowsColorPalette:
                isChanged === "hex" ? "" : v.sliderArrowsColorPalette
            };
          }
        },
        {
          id: "sliderArrowsColorPalette",
          type: "colorPalette",
          position: 20,
          value: v.sliderArrowsColorPalette,
          onChange: sliderArrowsColorPalette => ({
            sliderArrowsColorPalette,

            sliderArrowsColorOpacity:
              v.sliderArrowsColorOpacity === 0
                ? v.tempSliderArrowsColorOpacity
                : v.sliderArrowsColorOpacity
          })
        },
        {
          id: "sliderArrowsColorFields",
          type: "colorFields",
          position: 30,
          value: {
            hex: sliderArrowsColorHex,
            opacity: v.sliderArrowsColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => ({
            sliderArrowsColorPalette:
              isChanged === "hex" ? "" : v.sliderArrowsColorPalette,
            sliderArrowsColorHex: hex,
            sliderArrowsColorOpacity: opacity
          })
        }
      ]
    }
  ];
};

export function getItemsForDesktop(v, component) {
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
          id: "colorTabs",
          type: "tabs",
          tabs: gitSliderColorsTabs(v)
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
                    {
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      type: "switch",
                      value: v.showOnDesktop
                    },
                    {
                      type: "slider",
                      id: "zIndex",
                      label: t("Z-index"),
                      slider: {
                        min: 0,
                        max: 100
                      },
                      input: {
                        show: true,
                        min: 0
                      },
                      value: {
                        value: v.zIndex
                      },
                      onChange: ({ value: zIndex }) => ({
                        zIndex
                      })
                    },
                    {
                      id: "customClassName",
                      label: t("CSS Class"),
                      type: "input",
                      inputSize: "auto",
                      value: {
                        value: v.customClassName
                      },
                      onChange: ({ value: customClassName }) => ({
                        customClassName
                      })
                    }
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

export function getItemsForMobile(v) {
  return [
    {
      id: "showOnMobile",
      type: "toggle",
      position: 10,
      choices: [
        {
          icon: "nc-eye-17",
          title: t("Disable on Mobile"),
          value: "on"
        },
        {
          icon: "nc-eye-ban-18",
          title: t("Enable on Mobile"),
          value: "off"
        }
      ],
      value: v.showOnMobile
    }
  ];
}
