import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const paragraphColor = getColor(
    dvv("paragraphColorPalette"),
    dvv("paragraphColorHex"),
    dvv("paragraphColorOpacity")
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
      position: 70,
      options: [
        {
          id: "tabsToolbarTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabP",
              label: "P",
              options: [
                {
                  id: "paragraph",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabH1",
              label: "H1",
              options: [
                {
                  id: "h1",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabH2",
              label: "H2",
              options: [
                {
                  id: "h2",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabH3",
              label: "H3",
              options: [
                {
                  id: "h3",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabH4",
              label: "H4",
              options: [
                {
                  id: "h4",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabH5",
              label: "H5",
              options: [
                {
                  id: "h5",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabH6",
              label: "H6",
              options: [
                {
                  id: "h6",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
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
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: paragraphColor
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabParagraph",
              label: "P",
              options: [
                {
                  id: "paragraphColor",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabH1",
              label: "H1",
              options: [
                {
                  id: "h1Color",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabH2",
              label: "H2",
              options: [
                {
                  id: "h2Color",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabH3",
              label: "H3",
              options: [
                {
                  id: "h3Color",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabH4",
              label: "H4",
              options: [
                {
                  id: "h4Color",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabH5",
              label: "H5",
              options: [
                {
                  id: "h5Color",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabH6",
              label: "H6",
              options: [
                {
                  id: "h6Color",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ],
      onChange: (_, { isOpen }) => ({
        tabsState: !isOpen ? "" : v.tabsState,
        tabsColor: !isOpen ? "" : v.tabsColor
      })
    },
    {
      id: "excerptHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop"
    }
  ];
}
