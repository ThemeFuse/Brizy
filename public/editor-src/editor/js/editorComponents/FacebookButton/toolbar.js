import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const boxedLayout = dvv("layout") === "boxed";

  const boxShadowColor = getColorToolbar(
    dvv("boxShadowColorPalette"),
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorOpacity")
  );

  return [
    {
      id: "popoverCurrentElement",
      type: "popover",
      config: {
        icon: "nc-facebook",
        title: t("Button")
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
              label: t("Button"),
              options: [
                {
                  id: "targetUrl",
                  label: t("Target URL"),
                  type: "select",
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
                  type: "inputText",
                  devices: "desktop",
                  disabled: dvv("targetUrl") === "current",
                  placeholder: "http://",
                  config: {
                    size: "medium"
                  }
                },
                {
                  id: "type",
                  label: t("Type"),
                  type: "select",
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
                  type: "select",
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
                  type: "radioGroup",
                  choices: [
                    { icon: "nc-small", value: "small" },
                    { icon: "nc-large", value: "large" }
                  ]
                },
                {
                  id: "share",
                  label: t("Include Share Button"),
                  type: "switch",
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
                  type: "switch",
                  disabled: boxedLayout,
                  devices: "desktop"
                },
                {
                  id: "showFriends",
                  label: t("Show Friend's Faces"),
                  type: "switch",
                  disabled: boxedLayout,
                  devices: "desktop"
                }
                // {
                //   id: "darkScheme",
                //   label: t("Dark Scheme"),
                //   type: "switch",
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
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: boxShadowColor
          }
        }
      },
      devices: "desktop",
      position: 80,
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
    }
  ];
}
