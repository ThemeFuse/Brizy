import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getSelectBgColorCSS } from "./css";
import { sortBySelectSelector } from "./css/selectors";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state, component }) => {
  const config = component.getGlobalConfig();

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const selectTitleColor = getColorToolbar(
    dvv("selectTitleColorPalette"),
    dvv("selectTitleColorHex"),
    dvv("selectTitleColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyTitle",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabTypographyTitle",
              label: t("Title"),
              options: [
                {
                  id: "selectTitleTypography",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  },
                  selector: `${sortBySelectSelector} .form-control__select-text, ${sortBySelectSelector} .form-control__arrow`
                }
              ]
            },
            {
              id: "tabTypographySelect",
              label: t("List"),
              options: [
                {
                  id: "selectTypography",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  },
                  selector: `${sortBySelectSelector} select option`
                }
              ]
            }
          ]
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
            backgroundColor: selectTitleColor
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
              id: "tabColorTitle",
              label: t("Title"),
              options: [
                {
                  id: "selectTitleColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${sortBySelectSelector} .form-control__select-text, ${sortBySelectSelector} .form-control__arrow`
                }
              ]
            },
            {
              id: "tabColorSelect",
              label: t("List"),
              options: [
                {
                  id: "selectColor",
                  type: "colorPicker",
                  selector: `${sortBySelectSelector} select option`
                }
              ]
            },
            {
              id: "tabColorSelectBackground",
              label: t("Background"),
              options: [
                {
                  id: "selectBgColor",
                  type: "colorPicker",
                  style: getSelectBgColorCSS(config)
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
