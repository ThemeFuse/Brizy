import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const isTextDisabled = v.text === "off";

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-woo-rating",
        title: t("Product Rating")
      },
      position: 60,
      options: [
        {
          id: "text",
          label: t("Text"),
          devices: "desktop",
          type: "switch-dev"
        },
        {
          id: "ratingSize",
          type: "slider-dev",
          label: t("Size"),
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "spacing",
          type: "slider-dev",
          label: t("Spacing"),
          disabled: isTextDisabled,
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      devices: "desktop",
      options: [
        {
          id: "typography",
          type: "typography-dev",
          disabled: isTextDisabled,
          config: {
            fontFamily: "desktop" === device
          }
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
            backgroundColor: hexToRgba(dvv("colorHex"), dvv("colorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabStarColor",
              label: t("Rating"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgStarColor",
              label: t("Bg Star"),
              options: [
                {
                  id: "bgStarColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabTextColor",
              label: t("Text"),
              options: [
                {
                  id: "textColor",
                  type: "colorPicker-dev",
                  disabled: isTextDisabled,
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
}
