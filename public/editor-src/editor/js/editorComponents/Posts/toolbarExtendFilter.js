import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  // Color
  const bgColorOpacity = dvv("bgColorOpacity");
  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );

  const color = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  return [
    {
      id: "toolbarFilter",
      type: "popover",
      config: {
        icon: "nc-tags",
        title: t("Tags")
      },
      roles: ["admin"],
      position: 60,
      options: [
        {
          id: "filterStyle",
          type: "radioGroup",
          label: t("Style"),
          devices: "desktop",
          choices: [
            { value: "style-1", icon: "nc-tags-style-2" },
            { value: "style-2", icon: "nc-tags-style-1" }
          ]
        },
        {
          id: "filterSpacing",
          type: "slider",
          label: t("Spacing"),
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "afterFilterSpacing",
          type: "slider",
          label: t("Content Gap"),
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
      type: "popover",
      config: {
        icon: "nc-font",
        title: t("Typography"),
        size: device === "desktop" ? "large" : "auto"
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "filter",
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: bgColorOpacity > 0 ? bgColor : color
          }
        }
      },
      devices: "desktop",
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "filterBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "filterColor",
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
                  id: "filterBorder",
                  type: "border",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "filterBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "filterHorizontalAlign",
      type: "toggle",
      devices: "desktop",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      devices: "desktop",
      title: t("Settings")
    }
  ];
}
