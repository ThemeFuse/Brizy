import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const color = getColorToolbar(
    dvv("dayColorPalette"),
    dvv("dayColorHex"),
    dvv("dayColorOpacity")
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
          id: "eventStartTimeTypography",
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
            backgroundColor: color
          }
        }
      },
      position: 20,
      options: [
        {
          id: "eventStartTimeColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        title: t("Settings"),
        icon: "nc-cog"
      },
      position: 30,
      options: [
        {
          id: "timeFormat",
          type: "select",
          label: t("Time Format"),
          helper: {
            content: t("The time format to display in the event calendar.")
          },
          choices: [
            { title: t("12-hour"), value: "12" },
            { title: t("24-hour"), value: "24" }
          ]
        }
      ]
    }
  ];
};
