import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { toolbarElementFbButtonSize } from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvkn = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorPalette")
  );

  return [
    {
      id: dvkn("popoverCurrentElement"),
      type: "popover",
      icon: "nc-facebook",
      title: t("Button"),
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Button"),
              options: [
                {
                  id: "targetUrl",
                  label: t("Target URL"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Current Page"),
                      value: "current"
                    },
                    {
                      title: t("Custom Page"),
                      value: "custom"
                    }
                  ]
                },
                {
                  id: "href",
                  label: t("Link"),
                  type: "inputText-dev",
                  devices: "desktop",
                  disabled: v.targetUrl === "current",
                  placeholder: "http://"
                },
                {
                  id: "type",
                  label: t("Type"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Like"),
                      value: "like"
                    },
                    {
                      title: t("Recommend"),
                      value: "recommend"
                    }
                  ]
                },
                {
                  id: "layout",
                  label: t("Layout"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Button"),
                      value: "button"
                    },
                    {
                      title: t("Boxed"),
                      value: "boxed"
                    }
                  ]
                },
                toolbarElementFbButtonSize({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                {
                  id: "share",
                  label: t("Include Share Button"),
                  type: "switch-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "showCounter",
                  label: t("Show Button Counter"),
                  type: "switch-dev",
                  disabled: v.layout === "boxed" ? true : false,
                  devices: "desktop"
                },
                {
                  id: "showFriends",
                  label: t("Show Friends' Faces"),
                  type: "switch-dev",
                  disabled: v.layout === "boxed" ? true : false,
                  devices: "desktop"
                }
                // {
                //   id: "darkScheme",
                //   label: t("Dark Scheme"),
                //   type: "switch-dev",
                //   devices: "desktop"
                // }
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvkn("popoverColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      devices: "desktop",
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(boxShadowColorHex, v.boxShadowColorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
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
      id: dvkn("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    }
  ];
}
