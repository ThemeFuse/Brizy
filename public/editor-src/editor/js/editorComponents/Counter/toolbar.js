import { hexToRgba } from "visual/utils/color";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarElementCounterStyles } from "visual/utils/toolbar";
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
          tabs: [
            {
              id: "tabCurrentElementCounter",
              label: t("Counter"),
              options: [
                toolbarElementCounterStyles({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                {
                  id: "start",
                  type: "number-dev",
                  label: t("Start"),
                  devices: "desktop",
                  disabled: type !== "simple",
                  config: {
                    size: "short",
                    min: -1000000,
                    max: 1000000,
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
                    min: isSimple ? -1000000 : 0,
                    max: isSimple ? 1000000 : 100,
                    spinner: false
                  },
                  population: richTextDC
                },
                {
                  id: "strokeWidth",
                  label: t("Width"),
                  type: "slider-dev",
                  devices: "desktop",
                  disabled: isSimple || type === "pie",
                  config: {
                    min: 1,
                    max: 32
                  }
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
                  disabled: isSimple,
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
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
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
      icon: "nc-cog"
    }
  ];
}
