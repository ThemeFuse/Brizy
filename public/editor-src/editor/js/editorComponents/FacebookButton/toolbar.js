import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const boxedLayout = dvv("layout") === "boxed";

  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorPalette")
  );

  return [
    {
      id: "popoverCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-facebook",
        title: t("Button")
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
                  disabled: dvv("targetUrl") === "current",
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
                {
                  id: "size",
                  label: t("Size"),
                  devices: "desktop",
                  type: "radioGroup-dev",
                  choices: [
                    { icon: "nc-small", value: "small" },
                    { icon: "nc-large", value: "large" }
                  ]
                },
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
                  disabled: boxedLayout,
                  devices: "desktop"
                },
                {
                  id: "showFriends",
                  label: t("Show Friend's Faces"),
                  type: "switch-dev",
                  disabled: boxedLayout,
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
      id: "popoverColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              boxShadowColorHex,
              dvv("boxShadowColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
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
      id: "advancedSettings",
      devices: "desktop",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    }
  ];
}
