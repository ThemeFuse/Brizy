import Config from "visual/global/Config";
import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getTaxonomies
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";

import { toolbarElementCarouselTaxonomy } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: sliderArrowsColorHex } = getOptionColorHexByPalette(
    dvv("sliderArrowsColorHex"),
    dvv("sliderArrowsColorPalette")
  );

  const sliderArrowsChoices = [
    { title: t("None"), icon: "nc-none", value: "none" },
    { title: t("Thin"), icon: "nc-right-arrow-thin", value: "thin" },
    { title: t("Heavy"), icon: "nc-right-arrow-heavy", value: "heavy" },
    { title: t("Tail"), icon: "nc-right-arrow-tail", value: "tail" },
    { title: t("Round"), icon: "nc-right-arrow-filled", value: "filled" },
    { title: t("Outline"), icon: "nc-right-arrow-outline", value: "outline" }
  ];

  const wordpress = Boolean(Config.get("wp"));

  return [
    {
      id: "toolbarCarousel",
      type: "popover-dev",
      config: {
        icon: "nc-carousel",
        title: t("Carousel")
      },
      roles: ["admin"],
      disabled: device !== "desktop" && v.sliderArrows === "none",
      position: 70,
      options: [
        {
          id: "toolbarCarouselTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "carousel",
              label: t("Carousel"),
              options: [
                {
                  id: "groupSettings",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "sliderAutoPlay",
                      label: t("Auto Play"),
                      type: "switch-dev"
                    },
                    {
                      id: "sliderAutoPlaySpeed",
                      label: t("Speed"),
                      type: "slider-dev",
                      disabled: dvv("sliderAutoPlay") !== "on",
                      config: {
                        min: 1,
                        max: 6,
                        units: [{ value: "s", title: "s" }]
                      }
                    }
                  ]
                },
                {
                  id: "slidesToShow",
                  label: t("Columns"),
                  type: "slider-dev",
                  disabled: device === "mobile",
                  config: {
                    min: 1,
                    max: 6
                  }
                },
                {
                  id: "spacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  config: {
                    min: 1,
                    max: 6,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "sliderArrowsSpacing",
                  label: t("Arrows Spacing"),
                  type: "slider-dev",
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
              id: "navigation",
              label: t("Navigation"),
              options: [
                {
                  id: "groupSettings",
                  type: "group-dev",
                  devices: "desktop",
                  options: [
                    {
                      id: "sliderArrows",
                      label: t("Arrows"),
                      type: "select-dev",
                      choices: sliderArrowsChoices
                    },
                    {
                      id: "sliderArrowsSpacing",
                      label: t("Spacing"),
                      type: "slider-dev",
                      disabled: dvv("sliderArrows") === "none",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "sliderDots",
                  label: t("Dots"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("None"), icon: "nc-none", value: "none" },
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
      type: "popover-dev",
      config: {
        icon: "nc-dynamic",
        title: t("Dynamic Content")
      },
      devices: "desktop",
      disabled: !wordpress,
      position: 80,
      options: [
        {
          id: "dynamic",
          label: t("Dynamic Content"),
          type: "switch-dev",
          devices: "desktop"
        },
        toolbarElementCarouselTaxonomy({
          v,
          device,
          state: "normal",
          devices: "desktop",
          disabled: dvv("dynamic") === "off",
          choices: getTaxonomies()
        }),
        {
          id: "orderBy",
          label: t("Filter By"),
          devices: "desktop",
          disabled: dvv("dynamic") === "off",
          type: "select-dev",
          choices: [
            { title: t("ID"), value: "ID" },
            { title: t("Title"), value: "title" },
            { title: t("Date"), value: "date" },
            { title: t("Random"), value: "rand" },
            { title: t("Comment Count"), value: "comment_count" }
          ]
        },
        {
          id: "order",
          label: t("Order"),
          type: "radioGroup-dev",
          devices: "desktop",
          disabled: dvv("dynamic") === "off",
          choices: [
            { value: "ASC", icon: "nc-up" },
            { value: "DESC", icon: "nc-down" }
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
            backgroundColor: hexToRgba(
              sliderArrowsColorHex,
              dvv("sliderArrowsColorOpacity")
            )
          }
        }
      },
      position: 90,
      devices: "desktop",
      options: [
        {
          id: "colorTabs",
          type: "tabs-dev",
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
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "dots",
              label: t("Dots"),
              options: [
                {
                  id: "sliderDotsColor",
                  type: "colorPicker-dev",
                  disabled: v.slider === "off"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog"
    }
  ];
}
