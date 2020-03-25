import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementVideoPlaylistItemImageSize,
  toolbarFilterHue,
  toolbarFilterSaturation,
  toolbarFilterBrightness,
  toolbarFilterContrast,
  toolbarElementVideoPlaySize,
  toolbarVerticalAlign
} from "visual/utils/toolbar";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });

  return [
    {
      id: dvk("toolbarCurrentElement"),
      type: "popover",
      icon: "nc-play",
      devices: "desktop",
      title: t("Video"),
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementCover",
              label: t("Cover"),
              options: [
                {
                  id: "coverZoom",
                  label: t("Zoom"),
                  devices: "desktop",
                  type: "slider-dev",
                  config: {
                    min: 100,
                    max: 300,
                    units: [{ value: "%", title: "%" }]
                  }
                },
                toolbarElementVideoPlaySize({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            },
            {
              id: "tabCurrentElementFilter",
              label: t("Filters"),
              options: [
                toolbarFilterHue({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarFilterSaturation({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarFilterBrightness({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarFilterContrast({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("popoverTypography"),
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            },
            {
              id: "tabSubTitle",
              label: t("Sub Title"),
              options: [
                {
                  id: "subTitle",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      devices: "desktop",
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          color: hexToRgba(v.bgColorHex)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabPlay",
              label: t("Play"),
              position: 20,
              options: [
                {
                  id: "iconBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Icon"),
              position: 30,
              options: [
                {
                  id: "iconColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabVideoTitle",
              label: t("Title"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabVideoSubTitle",
              label: t("Sub Title"),
              options: [
                {
                  id: "subTitleColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgItem",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "itemBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarElementVideoPlaylistItemImageSize({
          v,
          device,
          state: "normal"
        }),
        toolbarVerticalAlign({
          v,
          device,
          position: 10,
          state: "normal",
          disabled: v.positionItem === "vertical"
        })
      ]
    }
  ];
}
