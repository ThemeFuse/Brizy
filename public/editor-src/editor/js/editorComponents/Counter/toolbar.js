import { hexToRgba } from "visual/utils/color";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { IS_STORY } from "visual/utils/models";

import { NORMAL, HOVER } from "visual/utils/stateMode";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, device, context }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { type } = v;
  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const isRadial = type === "radial";
  const isSimple = type === "simple";
  const isEmpty = type === "empty";
  const isPie = type === "pie";

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      devices: "desktop",
      config: {
        icon: "nc-counter-outline",
        title: t("Counter")
      },
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          config: {
            showSingle: true
          },
          tabs: [
            {
              id: "tabCurrentElementCounter",
              label: t("Counter"),
              options: [
                {
                  id: "type",
                  label: t("Style"),
                  type: "radioGroup-dev",
                  devices: "desktop",
                  choices: [
                    { value: "simple", icon: "nc-counter-style-1" },
                    { value: "radial", icon: "nc-counter-style-2" },
                    { value: "empty", icon: "nc-counter-style-3" },
                    { value: "pie", icon: "nc-counter-style-4" }
                  ]
                },
                {
                  id: "start",
                  type: "number-dev",
                  label: t("Start"),
                  devices: "desktop",
                  disabled: type !== "simple",
                  config: {
                    size: "short",
                    min: -1000000000,
                    max: 1000000000,
                    spinner: false
                  },
                  population: richTextDC
                },
                {
                  id: "end",
                  type: "number-dev",
                  label: t("End"),
                  devices: "desktop",
                  config: {
                    size: "short",
                    min: isSimple ? -1000000000 : 0,
                    max: isSimple ? 1000000000 : 100,
                    spinner: false
                  },
                  population: richTextDC
                },
                {
                  id: "duration",
                  label: t("Duration"),
                  type: "slider-dev",
                  devices: "desktop",
                  config: {
                    min: 0,
                    step: 0.2,
                    max: 10,
                    units: [{ value: "s", title: "s" }]
                  }
                }
              ]
            },
            {
              id: "tabCurrentElementAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "prefixLabelRadial",
                  label: t("Prefix"),
                  type: "inputText-dev",
                  placeholder: "Prefix",
                  disabled: !isRadial,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "suffixLabelRadial",
                  label: t("Suffix"),
                  type: "inputText-dev",
                  placeholder: "Suffix",
                  disabled: !isRadial,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "prefixLabel",
                  label: t("Prefix"),
                  type: "inputText-dev",
                  placeholder: "Prefix",
                  disabled: !isSimple,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "suffixLabel",
                  label: t("Suffix"),
                  type: "inputText-dev",
                  placeholder: "Suffix",
                  disabled: !isSimple,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "separator",
                  label: t("Separator"),
                  type: "inputText-dev",
                  placeholder: ",",
                  disabled: isEmpty || isPie,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      disabled: type === "empty" || type === "pie",
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
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
            backgroundColor: hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: type === "empty" || type === "pie"
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "fillColor",
                  type: "colorPicker-dev",
                  disabled: isSimple,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgProgress",
              label: t("Progress"),
              options: [
                {
                  id: "strokeColor",
                  type: "colorPicker-dev",
                  disabled: v.type !== "pie",
                  states: [NORMAL, HOVER]
                },
                {
                  id: "stroke",
                  type: "border-dev",
                  disabled: isSimple || isPie,
                  states: [NORMAL, HOVER],
                  config: {
                    width: ["grouped"],
                    styles: ["solid"]
                  }
                }
              ]
            },
            {
              id: "tabTextShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "textShadow",
                  type: "textShadow-dev",
                  disabled: !isSimple && !isRadial,
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      disabled: isSimple || IS_STORY,
      options: [
        {
          id: "width",
          label: t("Size"),
          type: "slider-dev",
          disabled: isSimple,
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "grid",
          type: "grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      disabled: !isSimple && !IS_STORY,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      devices: "desktop"
    }
  ];
}
