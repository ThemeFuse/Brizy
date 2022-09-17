import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { Value } from "./index";

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
      type: "popover-dev",
      config: { title: t("Shopping Bag"), icon: "nc-woo-cart" },
      position: 10,
      options: [
        {
          id: "iconDisplay",
          label: t("Cart Quantity"),
          type: "switch-dev"
        },
        {
          id: "groupSize",
          type: "group-dev",
          options: [
            {
              id: "size",
              label: t("Size"),
              type: "radioGroup-dev",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "customSize",
              type: "slider-dev",
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
          type: "slider-dev",
          label: t("Size"),
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
      type: "popover-dev",
      config: {
        size: "auto",
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
          type: "tabs-dev",
          tabs: [
            {
              id: "tabColor",
              label: t("Icon"),
              options: [
                {
                  id: "strokeColor",
                  type: "colorPicker-dev",
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
                  type: "backgroundColor-dev",
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
      // @ts-expect-error old option
      type: "advancedSettings",
      position: 30,
      icon: "nc-cog",
      devices: "desktop",
      title: t("Settings")
    }
  ];
}
