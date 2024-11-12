import { ElementModel } from "visual/component/Elements/Types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { ToolbarItemType } from "../ToolbarItemType";

export function getItems({
  v,
  device
}: {
  v: ElementModel;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-play",
        title: t("Video")
      },
      devices: "desktop",
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
                  type: "slider",
                  config: {
                    min: 100,
                    max: 300,
                    units: [{ value: "%", title: "%" }]
                  }
                },
                {
                  id: "iconSize",
                  label: t("Play"),
                  type: "slider",
                  devices: "desktop",
                  roles: ["admin"],
                  config: {
                    min: 50,
                    max: 200,
                    inputMin: 50,
                    inputMax: 200,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "tabCurrentElementFilter",
              label: t("Filters"),
              options: [
                {
                  id: "",
                  type: "filters",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
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
                  type: "typography",
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
                  type: "typography",
                  config: {
                    fontFamily: "desktop" === device
                  }
                }
              ]
            },
            {
              id: "tabControls",
              label: t("Controls"),
              options: [
                {
                  id: "controls",
                  type: "typography",
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
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      devices: "desktop",
      roles: ["admin"],
      position: 90,

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
                  type: "colorPicker",
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
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabIcons",
              label: t("Icons"),
              position: 30,
              options: [
                {
                  id: "iconControlsColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bar"),
              options: [
                {
                  id: "controlsBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgProgress",
              label: t("Slider"),
              options: [
                {
                  id: "controlsSliderColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabVideoSubTitle",
              label: t("Sub Title"),
              options: [
                {
                  id: "subTitleColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBgItem",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "itemBorder",
                  type: "border",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "widthImage",
          label: t("Size"),
          type: "slider",
          position: 10,
          config: {
            min: 0,
            max: 500,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "verticalAlign",
          label: t("Content"),
          type: "radioGroup",
          devices: "desktop",
          disabled: dvv("positionItem") === "vertical",
          position: 10,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" }
          ]
        }
      ]
    }
  ];
}
