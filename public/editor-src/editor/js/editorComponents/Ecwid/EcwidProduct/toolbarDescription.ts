import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { EcwidProductColumns, Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const descriptionColor = getColorToolbar(
    dvv("descriptionColorPalette"),
    dvv("descriptionColorHex"),
    dvv("descriptionColorOpacity")
  );

  const columns = dvv("columns");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      position: 10,
      config: { icon: "nc-woo-related-products", title: t("Description") },
      devices: "desktop",
      options: [
        {
          id: "positionDescription",
          label: t("Position"),
          type: "slider",
          disabled:
            columns === EcwidProductColumns.ThreeLeft ||
            columns === EcwidProductColumns.ThreeRight ||
            dvv("descriptionPosition") === "besideImage",
          config: {
            min: 100,
            max: 1000,
            step: 100
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
      position: 20,
      options: [
        {
          id: "descriptionTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" }
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
            backgroundColor: descriptionColor
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "descriptionColor",
          type: "colorPicker"
        }
      ]
    },
    {
      id: "descriptionHorizontalAlign",
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
      position: 50,
      options: [
        {
          id: "descriptionSpacing",
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
