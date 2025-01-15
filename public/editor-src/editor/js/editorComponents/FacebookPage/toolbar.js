import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const borderColor = getColor(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-facebook",
        title: t("Page")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Page"),
              options: [
                {
                  id: "href",
                  label: t("Link"),
                  type: "inputText",
                  devices: "desktop",
                  placeholder: "https://facebook.com/brizy.io",
                  config: {
                    size: "medium"
                  }
                },
                {
                  id: "pageTabs",
                  label: t("Tabs"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: t("Timeline"), value: "timeline" },
                    { title: t("Events"), value: "events" },
                    { title: t("Messages"), value: "messages" }
                  ]
                },
                {
                  id: "height",
                  label: t("Height"),
                  type: "slider",
                  devices: "desktop",
                  config: {
                    min: 70,
                    max: 800,
                    units: [{ value: "px", title: "px" }],
                    debounceUpdate: true
                  }
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              type: "tabs",
              options: [
                {
                  id: "smallHeader",
                  label: t("Use Small Header"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "hideCover",
                  label: t("Hide Cover Photo"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showFacepile",
                  label: t("Show Friend's Faces"),
                  type: "switch",
                  devices: "desktop"
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
            backgroundColor: borderColor
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          config: {
            showSingle: true
          },
          tabs: [
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
      id: "advancedSettings",
      devices: "desktop",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110
    },
    { id: "horizontalAlign", type: "toggle", disabled: true }
  ];
}
