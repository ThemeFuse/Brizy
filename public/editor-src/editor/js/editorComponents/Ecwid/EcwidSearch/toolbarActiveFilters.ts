import {
  applyButtonSelectorMobile,
  filtersActiveSelector,
  showItemsSelectorMobile
} from "visual/editorComponents/Ecwid/EcwidSearch/css/selectors";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const filtersActiveColor = getColorToolbar(
    dvv("filtersActiveColorPalette"),
    dvv("filtersActiveColorHex"),
    dvv("filtersActiveColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyInputs",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "filtersActiveTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${filtersActiveSelector}, ${applyButtonSelectorMobile}, ${showItemsSelectorMobile}`
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
            backgroundColor: filtersActiveColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabColor",
              label: t("Color"),
              options: [
                {
                  id: "filtersActiveColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${filtersActiveSelector}, ${applyButtonSelectorMobile}, ${showItemsSelectorMobile}`
                }
              ]
            },
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "filtersActive",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: `${filtersActiveSelector}, ${applyButtonSelectorMobile}, ${showItemsSelectorMobile}`
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "filtersActiveBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: `${filtersActiveSelector}, ${applyButtonSelectorMobile}, ${showItemsSelectorMobile}`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "filtersActiveBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: `${filtersActiveSelector}, ${applyButtonSelectorMobile}, ${showItemsSelectorMobile}`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
