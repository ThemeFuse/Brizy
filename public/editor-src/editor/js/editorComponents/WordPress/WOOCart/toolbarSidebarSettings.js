import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const color = getColor(
    dvv("sidebarBgColorPalette"),
    dvv("sidebarBgColorHex"),
    dvv("sidebarBgColorOpacity")
  );

  return [
    {
      id: "cartHorizontalAlign",
      type: "toggle",
      disabled: dvv("sidebarWidth") >= 100 && dvv("sidebarWidthSuffix") === "%",
      position: 90,
      choices: [
        { icon: "nc-hrz-align-left", title: t("Align"), value: "left" },
        { icon: "nc-hrz-align-center", title: t("Align"), value: "center" },
        { icon: "nc-hrz-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "cartVerticalAlign",
      type: "toggle",
      disabled:
        dvv("sidebarHeightStyle") === "fullHeight" ||
        (dvv("sidebarHeight") >= 100 &&
          dvv("sidebarHeightSuffix") === "vh" &&
          dvv("sidebarHeightStyle") !== "auto"),
      position: 110,
      choices: [
        { icon: "nc-ver-align-top", title: t("Align"), value: "top" },
        { icon: "nc-ver-align-middle", title: t("Align"), value: "center" },
        { icon: "nc-ver-align-bottom", title: t("Align"), value: "bottom" }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "sidebarBgColor",
          type: "colorPicker"
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "sidebarWidth",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: dvv("sidebarWidthSuffix") === "px" ? 500 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "groupHeight",
          type: "group",
          position: 100,
          options: [
            {
              id: "sidebarHeightStyle",
              label: t("Height"),
              type: "select",
              choices: [
                { title: t("Auto"), value: "auto" },
                { title: t("Custom"), value: "custom" },
                { title: t("Full Height"), value: "fullHeight" }
              ]
            },
            {
              id: "sidebarHeight",
              type: "slider",
              disabled: dvv("sidebarHeightStyle") !== "custom",
              config: {
                min: 20,
                max: dvv("sidebarHeightSuffix") === "px" ? 500 : 100,
                units: [
                  { title: "px", value: "px" },
                  { title: "%", value: "vh" }
                ]
              }
            }
          ]
        }
      ]
    }
  ];
}
