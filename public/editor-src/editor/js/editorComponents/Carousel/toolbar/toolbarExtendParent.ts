import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { ToolbarContext } from "visual/utils/elements/posts/types";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ArrowPosition, ArrowStyle, Props, Value } from "../types";
import { tabFilter } from "./tabFilter";

export default (context?: ToolbarContext) => ({
  getItems: getItems(context)
});

const getItems =
  (context?: ToolbarContext): GetItems<Value, Props> =>
  ({ v, device, component }) => {
    const dvv = (key: string) =>
      defaultValueValue({ key, v, device, state: "normal" });

    const sliderArrowsColor = getColorToolbar(
      dvv("sliderArrowsColorPalette"),
      dvv("sliderArrowsColorHex"),
      dvv("sliderArrowsColorOpacity")
    );

    const sliderArrowsChoices = [
      {
        title: t("Custom"),
        value: "custom"
      },
      {
        title: t("Thin"),
        icon: { name: "nc-right-arrow-thin" },
        value: "thin"
      },
      {
        title: t("Heavy"),
        icon: { name: "nc-right-arrow-heavy" },
        value: "heavy"
      },
      {
        title: t("Tail"),
        icon: { name: "nc-right-arrow-tail" },
        value: "tail"
      },
      {
        title: t("Round"),
        icon: { name: "nc-right-arrow-filled" },
        value: "filled"
      },
      {
        title: t("Outline"),
        icon: { name: "nc-right-arrow-outline" },
        value: "outline"
      }
    ];

    const isAutoPlayEnabled = dvv("sliderAutoPlay") === "on";
    const isDynamicContent = dvv("dynamic") === "on";
    const config = component.getGlobalConfig();

    const filtersOptions =
      context && isDynamicContent ? tabFilter({ v, context, config }) : [];

    const isCustomArrow = dvv("sliderArrows") === "custom";
    const currentArrowStyle = dvv("arrowStyle");
    const isArrowDisabled = currentArrowStyle === ArrowStyle.style3;
    const isArrowStyle2 = currentArrowStyle === ArrowStyle.style2;

    return [
      {
        id: "toolbarCarousel",
        type: "popover",
        config: {
          icon: "nc-carousel",
          title: t("Carousel")
        },
        position: 70,
        options: [
          {
            id: "toolbarCarouselTabs",
            type: "tabs",
            tabs: [
              {
                id: "carousel",
                label: t("Carousel"),
                options: [
                  {
                    id: "groupSettings",
                    type: "group",
                    devices: "desktop",
                    options: [
                      {
                        id: "sliderAutoPlay",
                        label: t("Autoplay"),
                        type: "switch"
                      },
                      {
                        id: "sliderAutoPlaySpeed",
                        label: t("Stop Time"),
                        type: "slider",
                        disabled: !isAutoPlayEnabled,
                        config: {
                          min: 0,
                          max: 6,
                          units: [{ value: "s", title: "s" }]
                        }
                      },
                      {
                        id: "stopSlider",
                        type: "switch",
                        label: t("Stop animation"),
                        disabled: !isAutoPlayEnabled,
                        helper: {
                          content: t(
                            "When enabled, clicking pause stops the animation and slider until play is clicked"
                          )
                        }
                      }
                    ]
                  },
                  {
                    id: "transitionSpeed",
                    label: t("Speed"),
                    type: "slider",
                    config: {
                      min: 1,
                      max: 40,
                      step: 0.1,
                      units: [{ value: "s", title: "s" }]
                    }
                  },
                  {
                    id: "slidesToShow",
                    label: t("Columns"),
                    type: "slider",
                    config: {
                      min: 1,
                      max: device === "mobile" ? 3 : 6
                    }
                  },
                  {
                    id: "sliderAnimation",
                    label: t("Animation"),
                    type: "radioGroup",
                    disabled: dvv("slidesToShow") > 1,
                    choices: [
                      {
                        icon: "nc-slider-horizontal",
                        value: "none"
                      },
                      {
                        icon: "nc-fade",
                        value: "fade"
                      }
                    ]
                  },
                  {
                    id: "spacing",
                    label: t("Spacing"),
                    type: "slider",
                    config: {
                      min: 1,
                      max: 100,
                      units: [{ value: "px", title: "px" }]
                    }
                  },
                  {
                    id: "sliderArrowsSpacing",
                    label: t("Arrows Spacing"),
                    type: "slider",
                    disabled: dvv("sliderArrows") === "none",
                    devices: "responsive",
                    config: {
                      min: 0,
                      max: 100,
                      units: [{ value: "px", title: "px" }]
                    }
                  }
                ]
              },
              {
                id: "arrowTabs",
                label: t("Arrows"),
                options: [
                  {
                    id: "arrowStyle",
                    label: t("Style"),
                    type: "radioGroup",
                    devices: "desktop",
                    choices: [
                      {
                        value: ArrowStyle.style1,
                        icon: "t2-carousel-arrow-style1",
                        title: t("Both sides")
                      },
                      {
                        value: ArrowStyle.style2,
                        icon: "t2-carousel-arrow-style2",
                        title: t("One side")
                      },
                      {
                        value: ArrowStyle.style3,
                        icon: "t2-carousel-arrow-style3",
                        title: t("None")
                      }
                    ]
                  },
                  {
                    id: "arrowGroupSetting",
                    type: "group",
                    devices: "desktop",
                    options: [
                      {
                        id: "sliderArrows",
                        label: t("Arrows"),
                        type: "select",
                        choices: sliderArrowsChoices,
                        disabled: isArrowDisabled
                      },
                      {
                        id: "sliderArrowsCustom",
                        type: "iconSetter",
                        label: t("Custom"),
                        disabled: !isCustomArrow || isArrowDisabled,
                        config: {
                          canDelete: true
                        }
                      }
                    ]
                  },
                  {
                    id: "arrowPosition",
                    label: t("Position"),
                    type: "select",
                    disabled: !isArrowStyle2,
                    devices: "desktop",
                    choices: [
                      {
                        title: t("Top Left"),
                        value: ArrowPosition.TopLeft,
                        icon: { name: "t2-carousel-arrow-top-left" }
                      },
                      {
                        title: t("Top Right"),
                        value: ArrowPosition.TopRight,
                        icon: { name: "t2-carousel-arrow-top-right" }
                      },
                      {
                        title: t("Middle Left"),
                        value: ArrowPosition.MiddleLeft,
                        icon: { name: "t2-carousel-arrow-middle-left" }
                      },
                      {
                        title: t("Middle Right"),
                        value: ArrowPosition.MiddleRight,
                        icon: { name: "t2-carousel-arrow-middle-right" }
                      },
                      {
                        title: t("Bottom Left"),
                        value: ArrowPosition.BottomLeft,
                        icon: { name: "t2-carousel-arrow-bottom-left" }
                      },
                      {
                        title: t("Bottom Middle"),
                        value: ArrowPosition.BottomMiddle,
                        icon: { name: "t2-carousel-arrow-bottom-middle" }
                      },
                      {
                        title: t("Bottom Right"),
                        value: ArrowPosition.BottomRight,
                        icon: { name: "t2-carousel-arrow-bottom-right" }
                      }
                    ]
                  },
                  {
                    id: "sliderArrowsSpacing",
                    label: t("Spacing"),
                    type: "slider",
                    disabled: isArrowDisabled,
                    devices: "desktop",
                    config: {
                      min: 0,
                      max: 100,
                      units: [{ value: "px", title: "px" }]
                    }
                  },
                  {
                    id: "sizeArrowGroup",
                    type: "group",
                    disabled: isArrowDisabled,
                    devices: "desktop",
                    options: [
                      {
                        id: "arrowSize",
                        label: t("Size"),
                        type: "radioGroup",
                        choices: [
                          { value: "small", icon: "nc-32" },
                          { value: "medium", icon: "nc-48" },
                          { value: "large", icon: "nc-64" },
                          { value: "custom", icon: "nc-more" }
                        ]
                      },
                      {
                        id: "customArrowSize",
                        type: "slider",
                        disabled: dvv("arrowSize") !== "custom",
                        config: {
                          min: 14,
                          max: 180,
                          units: [{ title: "px", value: "px" }]
                        }
                      }
                    ]
                  }
                ]
              },
              {
                id: "arrowDots",
                label: t("Dots"),
                options: [
                  {
                    id: "dotsGroup",
                    type: "group",
                    devices: "desktop",
                    options: [
                      {
                        id: "sliderDots",
                        label: t("Dots"),
                        type: "select",
                        devices: "desktop",
                        choices: [
                          {
                            title: t("Custom"),
                            value: "custom"
                          },
                          {
                            title: t("None"),
                            icon: { name: "nc-none" },
                            value: "none"
                          },
                          {
                            title: t("Circle"),
                            icon: { name: "nc-circle-outline" },
                            value: "circle"
                          },
                          {
                            title: t("Diamond"),
                            icon: { name: "nc-diamond-outline" },
                            value: "diamond"
                          },
                          {
                            title: t("Square"),
                            icon: { name: "nc-square-outline" },
                            value: "square"
                          }
                        ]
                      },
                      {
                        id: "sliderDotsCustom",
                        type: "iconSetter",
                        label: t("Custom"),
                        disabled: dvv("sliderDots") !== "custom",
                        config: {
                          canDelete: true
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
        id: "dynamicToolbarCarousel",
        type: "popover",
        config: {
          icon: "nc-dynamic",
          title: t("Dynamic Content")
        },
        devices: "desktop",
        position: 80,
        options: [
          {
            id: "dynamic",
            label: t("Dynamic Content"),
            type: "switch"
          },
          ...filtersOptions
        ]
      },
      {
        id: "toolbarColor",
        type: "popover",
        config: {
          size: "medium",
          title: t("Colors"),
          icon: {
            style: {
              backgroundColor: sliderArrowsColor
            }
          }
        },
        position: 90,
        devices: "desktop",
        options: [
          {
            id: "colorTabs",
            type: "tabs",
            config: {
              showSingle: true
            },
            tabs: [
              {
                id: "arrows",
                label: t("Arrows"),
                options: [
                  {
                    id: "sliderArrowsColor",
                    type: "colorPicker"
                  }
                ]
              },
              {
                id: "dots",
                label: t("Dots"),
                options: [
                  {
                    id: "sliderDotsColor",
                    type: "colorPicker",
                    disabled: dvv("slider") === "off"
                  }
                ]
              },
              {
                id: "navigationBgTab",
                label: t("Bg"),
                options: [
                  {
                    id: "navigation",
                    type: "backgroundColor"
                  }
                ]
              },
              {
                id: "pauseColorTab",
                label: t("Pause"),
                options: [
                  {
                    id: "sliderPauseColor",
                    type: "colorPicker",
                    disabled: dvv("slider") === "off"
                  }
                ]
              }
            ]
          }
        ]
      },
      { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
      {
        id: "advancedSettings",
        type: "advancedSettings",
        position: 110,
        title: t("Settings"),
        devices: "desktop"
      }
    ];
  };
