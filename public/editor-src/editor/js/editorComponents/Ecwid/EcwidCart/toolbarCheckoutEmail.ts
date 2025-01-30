import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { checkoutEmailBorderCSS } from "./css";
import { checkoutEmailIconSelector } from "./css/selectors";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkoutEmailColor = getColorToolbar(
    dvv("checkoutEmailColorPalette"),
    dvv("checkoutEmailColorHex"),
    dvv("checkoutEmailColorOpacity")
  );

  return [
    {
      id: "toolbarColorCheckoutEmail",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: checkoutEmailColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "checkoutEmailIconTabs",
          type: "tabs",
          tabs: [
            {
              id: "tabColor",
              label: t("Icon"),
              options: [
                {
                  id: "checkoutEmailColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: checkoutEmailIconSelector
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "checkoutEmailBorder",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: checkoutEmailBorderCSS
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
