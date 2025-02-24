import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { checkboxLinkSelector } from "./css/selectors";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkboxLinkColor = getColorToolbar(
    dvv("checkboxLinkColorPalette"),
    dvv("checkboxLinkColorHex"),
    dvv("checkboxLinkColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyCheckboxLink",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "checkboxLinkTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: checkboxLinkSelector
        }
      ]
    },
    {
      id: "toolbarColorCheckboxLink",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: checkboxLinkColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "checkboxLinkColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: checkboxLinkSelector
        }
      ]
    }
  ];
};
