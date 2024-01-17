import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const type = dvv("type");

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const isRadial = type === "radial";
  const isSimple = type === "simple";
  const isEmpty = type === "empty";
  const isPie = type === "pie";

  const IS_STORY = isStory(Config.getAll());

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      devices: "desktop",
      config: {
        icon: "nc-counter-outline",
        title: t("Counter")
      },
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
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
                  type: "radioGroup",
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
                  type: "number",
                  label: t("Start"),
                  devices: "desktop",
                  disabled: !isSimple,
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
                  type: "number",
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
                  type: "slider",
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
                  type: "inputText",
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
                  type: "inputText",
                  placeholder: t("Suffix"),
                  disabled: !isRadial,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "prefixLabel",
                  label: t("Prefix"),
                  type: "inputText",
                  placeholder: t("Prefix"),
                  disabled: !isSimple,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "suffixLabel",
                  label: t("Suffix"),
                  type: "inputText",
                  placeholder: t("Suffix"),
                  disabled: !isSimple,
                  config: {
                    size: "medium"
                  },
                  population: richTextDC
                },
                {
                  id: "separator",
                  label: t("Separator"),
                  type: "inputText",
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
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      disabled: isEmpty || isPie,
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
      id: "popoverColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: isEmpty || isPie
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "fillColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
                  disabled: !isPie,
                  states: [NORMAL, HOVER]
                },
                {
                  id: "stroke",
                  type: "border",
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
                  type: "textShadow",
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
      type: "popover",
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
          type: "slider",
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
          config: {
            separator: true
          },
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
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
                  type: "sidebarTabsButton",
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
      type: "legacy-advancedSettings",
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
