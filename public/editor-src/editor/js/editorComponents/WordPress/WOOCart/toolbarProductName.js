import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const color = getColor(
    dvv("titleColorPalette"),
    dvv("titleColorHex"),
    dvv("titleColorOpacity")
  );

  return [
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
          id: "title",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor2",
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
          id: "titleColor",
          type: "colorPicker",
          devices: "desktop",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
}
