import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const color = getColorToolbar(
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
      position: 10,
      options: [
        {
          id: "titleTypography",
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
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      position: 20,
      options: [
        {
          id: "titleColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 30,
      options: [
        {
          id: "titleSpacing",
          label: t("Bottom"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
