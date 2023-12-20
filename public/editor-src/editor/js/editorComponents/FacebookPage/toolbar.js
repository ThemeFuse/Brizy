import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-facebook",
        title: t("Page")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Page"),
              options: [
                {
                  id: "href",
                  label: t("Link"),
                  type: "inputText-dev",
                  devices: "desktop",
                  placeholder: "https://facebook.com/brizy.io",
                  config: {
                    size: "medium"
                  }
                },
                {
                  id: "pageTabs",
                  label: t("Tabs"),
                  type: "select-dev",
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
                  type: "slider-dev",
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
              type: "tabs-dev",
              options: [
                {
                  id: "smallHeader",
                  label: t("Use Small Header"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "hideCover",
                  label: t("Hide Cover Photo"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showFacepile",
                  label: t("Show Friend's Faces"),
                  type: "switch-dev",
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
      type: "popover-dev",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              borderColorHex,
              dvv("borderColorOpacity")
            )
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
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
                  type: "border-dev",
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
                  type: "boxShadow-dev",
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
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    },
    { id: "horizontalAlign", type: "toggle-dev", disabled: true }
  ];
}
