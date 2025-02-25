import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getAlignFn } from "./css";
import { titleEmptySelector } from "./css/selectors";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const titleColor = getColorToolbar(
    dvv("titleColorEmptyPalette"),
    dvv("titleColorEmptyHex"),
    dvv("titleColorEmptyOpacity")
  );

  return [
    {
      id: "toolbarTypographyTitleEmpty",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "titleTypographyEmpty",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: titleEmptySelector
        }
      ]
    },
    {
      id: "toolbarColorEmpty",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: titleColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "titleColorEmpty",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: titleEmptySelector
        }
      ]
    },
    {
      id: "titleHorizontalAlignEmpty",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: getAlignFn(titleEmptySelector)
    }
  ];
};
