import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getSelectBgColorCSS } from "./css";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const phoneSelectBgColor = getColorToolbar(
    dvv("phoneSelectColorPalette"),
    dvv("phoneSelectColorHex"),
    dvv("phoneSelectColorOpacity")
  );

  const config = component.getGlobalConfig();

  return [
    {
      id: "toolbarColorPhoneSelect",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: phoneSelectBgColor
          }
        }
      },
      position: 80,
      options: [
        {
          id: "tabsPhoneSelectColor",
          type: "tabs",
          tabs: [
            {
              id: "tabPhoneSelectText",
              label: t("Text"),
              options: [
                {
                  id: "phoneSelectColor",
                  type: "colorPicker",
                  selector:
                    "{{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__phone--country .ss-content .ss-list, {{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__phone--country .ss-content .ss-search"
                }
              ]
            },
            {
              id: "tabPhoneSelectCode",
              label: t("Code"),
              options: [
                {
                  id: "phoneSelectCodeColor",
                  type: "colorPicker",
                  selector:
                    "{{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__field-phone--option-code"
                }
              ]
            },
            {
              id: "tabPhoneSelectBg",
              label: t("Bg"),
              options: [
                {
                  id: "phoneSelectBgColor",
                  type: "colorPicker",
                  style: getSelectBgColorCSS(config)
                }
              ]
            },
            {
              id: "tabPhoneSelectBorder",
              label: t("Border"),
              options: [
                {
                  id: "phoneSelectBorder",
                  type: "border",
                  selector:
                    "{{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__phone--country .ss-content .ss-list .ss-option, {{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__phone--country .ss-content .ss-search",
                  config: {
                    width: ["grouped"]
                  }
                }
              ]
            },
            {
              id: "tabPhoneSelectBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "phoneSelectBoxShadow",
                  type: "boxShadow",
                  selector:
                    "{{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__phone--country .ss-content"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
