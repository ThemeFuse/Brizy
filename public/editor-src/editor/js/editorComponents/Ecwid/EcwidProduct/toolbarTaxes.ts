import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const taxesColor = getColor(
    dvv("taxesColorPalette"),
    dvv("taxesColorHex"),
    dvv("taxesColorOpacity")
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
      position: 10,
      options: [
        {
          id: "taxesTypography",
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
            backgroundColor: taxesColor
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "taxesColor",
          type: "colorPicker"
        }
      ]
    },
    {
      id: "taxesHorizontalAlign",
      type: "toggle",
      position: 40,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 50,
      options: [
        {
          id: "taxesSpacing",
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
