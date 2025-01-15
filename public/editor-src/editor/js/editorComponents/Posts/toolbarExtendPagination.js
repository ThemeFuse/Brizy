import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });
  const paginationColor = getColor(
    dvv("paginationColorPalette"),
    dvv("paginationColorHex"),
    dvv("paginationColorOpacity")
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover",
      position: 70,
      roles: ["admin"],
      config: {
        title: t("Typography"),
        size: device === "desktop" ? "large" : "auto",
        icon: "nc-font"
      },
      options: [
        {
          id: "pagination",
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
            backgroundColor: paginationColor
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
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "paginationBgColor",
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
                  id: "paginationColor",
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
                  id: "paginationBorder",
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
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      roles: ["admin"],
      devices: "desktop",
      title: t("Settings")
    }
  ];
}
