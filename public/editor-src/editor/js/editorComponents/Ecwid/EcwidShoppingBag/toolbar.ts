import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: strokeColorHex } = getOptionColorHexByPalette(
    dvv("strokeColorHex"),
    dvv("strokeColorPalette")
  );
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: { title: t("Shopping Bag"), icon: "nc-woo-cart" },
      position: 10,
      options: [
        {
          id: "iconDisplay",
          label: t("Cart Quantity"),
          type: "switch"
        },
        {
          id: "groupSize",
          type: "group",
          options: [
            {
              id: "size",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "customSize",
              type: "slider",
              disabled: dvv("size") !== "custom",
              config: {
                min: 8,
                max: 50,
                units: [{ title: "px", value: "px" }]
              }
            }
          ]
        },
        {
          id: "padding",
          type: "slider",
          label: t("Padding"),
          config: {
            min: 0,
            max: 180,
            units: [{ title: "px", value: "px" }]
          }
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
            backgroundColor: hexToRgba(
              strokeColorHex,
              dvv("strokeColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabColor",
              label: t("Icon"),
              options: [
                {
                  id: "strokeColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
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
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      devices: "desktop",
      title: t("Settings")
    }
  ];
}
