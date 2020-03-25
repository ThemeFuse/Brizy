import Config from "visual/global/Config";
import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getTaxonomies
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";

import {
  toolbarElementCarouselAutoPlay,
  toolbarElementCarouselNavigationArrow,
  toolbarElementCarouselNavigationDots,
  toolbarElementCarouselTaxonomy,
  toolbarElementCarouselOrderBy,
  toolbarElementCarouselOrder
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: sliderArrowsColorHex } = getOptionColorHexByPalette(
    dvv("sliderArrowsColorHex"),
    dvv("sliderArrowsColorPalette")
  );

  const wordpress = Boolean(Config.get("wp"));

  return [
    {
      id: dvk("toolbarCarousel"),
      type: "popover",
      icon: "nc-carousel",
      title: t("Carousel"),
      roles: ["admin"],
      disabled: device !== "desktop" && v.sliderArrows === "none",
      position: 70,
      options: [
        {
          id: dvk("toolbarCarouselTabs"),
          type: "tabs",
          tabs: [
            {
              id: dvk("carousel"),
              label: t("Carousel"),
              options: [
                toolbarElementCarouselAutoPlay({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
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
              id: dvk("navigation"),
              label: t("Navigation"),
              options: [
                toolbarElementCarouselNavigationArrow({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                toolbarElementCarouselNavigationDots({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("dynamicToolbarCarousel"),
      type: "popover",
      icon: "nc-dynamic",
      title: t("Dynamic Content"),
      roles: ["admin"],
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
        toolbarElementCarouselOrderBy({
          v,
          device,
          state: "normal",
          devices: "desktop",
          disabled: dvv("dynamic") === "off"
        }),
        toolbarElementCarouselOrder({
          v,
          device,
          state: "normal",
          devices: "desktop",
          disabled: dvv("dynamic") === "off"
        })
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      position: 90,
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      icon: {
        style: {
          backgroundColor: hexToRgba(
            sliderArrowsColorHex,
            dvv("sliderArrowsColorOpacity")
          )
        }
      },
      options: [
        {
          id: dvk("colorTabs"),
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: dvk("arrows"),
              label: t("Arrows"),
              options: [
                {
                  id: "sliderArrowsColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: dvk("dots"),
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
