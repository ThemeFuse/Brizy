import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const labelColor = getColor(
    dvv("labelColorPalette"),
    dvv("labelColorHex"),
    dvv("labelColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-form-left",
        title: t("Field")
      },
      position: 60,
      options: [
        {
          id: "labelPaddingBottom",
          label: t("Spacing"),
          position: 60,
          type: "slider",
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
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "label",
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
            backgroundColor: labelColor
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "labelColor",
          type: "colorPicker"
        }
      ]
    },
    {
      id: "labelHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
}
