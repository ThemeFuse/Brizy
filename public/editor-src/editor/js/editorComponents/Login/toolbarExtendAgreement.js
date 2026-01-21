import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const checkboxColor = getColorToolbar(
    dvv("agreementColorPalette"),
    dvv("agreementColorHex"),
    dvv("agreementColorOpacity")
  );

  const enableCustomHtml = dvv("enableCustomHtml") !== "on";

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-form-left",
        title: t("Field")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElementFields",
          type: "tabs",
          tabs: [
            {
              id: "tabsCurrentElementField",
              label: t("Field"),
              options: [
                {
                  id: "borderRadiusTypeGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "enableCustomHtml",
                      type: "switch",
                      label: t("Enable custom HTML"),
                      helper: {
                        content: t(
                          "Enable custom HTML to add custom HTML to the field."
                        )
                      }
                    },
                    {
                      id: "customHtml",
                      type: "textarea",
                      disabled: enableCustomHtml,
                      display: "block"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypographyAgreement",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "agreement",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorAgreement",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: checkboxColor
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "agreementColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "agreementHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
}
