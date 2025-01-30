import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const subtitleColor = getColorToolbar(
    dvv("subtitleColorPalette"),
    dvv("subtitleColorHex"),
    dvv("subtitleColorOpacity")
  );

  return [
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "subtitleTypography",
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
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: subtitleColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "subtitleColor",
          type: "colorPicker"
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "CENTER" },
        { icon: "nc-text-align-center", title: t("Align"), value: "LEFT" },
        { icon: "nc-text-align-right", title: t("Align"), value: "RIGHT" },
        { icon: "nc-text-align-justify", title: t("Align"), value: "JUSTIFY" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 40,
      options: [
        {
          id: "subtitleSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
