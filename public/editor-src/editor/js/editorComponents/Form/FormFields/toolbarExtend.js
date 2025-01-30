import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const bgColorOpacity = dvv("bgColorOpacity");
  const colorOpacity = dvv("colorOpacity");
  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );

  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    colorOpacity
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-form-left",
        title: t("Field"),
        size: "large"
      },
      position: 60,
      options: [
        {
          id: "padding",
          type: "slider",
          label: t("Spacing"),
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
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
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
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
            backgroundColor: bgColorOpacity > 0 ? bgColor : color
          }
        }
      },
      position: 80,
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "bgColor",
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "labelColor",
              label: t("Label"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "borderColor",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
