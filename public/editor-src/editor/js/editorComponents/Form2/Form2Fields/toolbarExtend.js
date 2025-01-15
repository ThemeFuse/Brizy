import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const checkboxColor = getColor(
    dvv("checkboxColorPalette"),
    dvv("checkboxColorHex"),
    dvv("checkboxColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "background",
              options: [
                {
                  id: "size",
                  label: t("Size"),
                  type: "radioGroup",
                  position: 17,
                  choices: [
                    { icon: "nc-small", value: "small" },
                    { icon: "nc-medium", value: "medium" },
                    { icon: "nc-large", value: "large" }
                  ]
                }
              ]
            }
          ]
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
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarTypographyCheckbox",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "checkbox",
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
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColorCheckbox",
      type: "popover",
      config: {
        size: "auto",
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
          id: "checkboxColor",
          type: "colorPicker"
        }
      ]
    }
  ];
}
