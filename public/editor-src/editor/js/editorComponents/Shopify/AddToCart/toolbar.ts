import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { DeviceMode } from "visual/types";
import { getSourceIds } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import * as Str from "visual/utils/reader/string";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { Value } from ".";

export const getItems = ({
  v,
  device,
  state
}: {
  v: Value;
  device: DeviceMode;
  state: State;
}): ToolbarItemType[] => {
  const config = Config.getAll();

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const iconName = dvv("iconName");

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const sourceType = Str.read(dvv("sourceType")) ?? "";
  const sourceItemsHandler = config?.api?.sourceItems?.handler;

  return [
    {
      id: "toolbarCart",
      type: "popover-dev",
      position: 50,
      config: {
        size: "auto",
        title: t("Products"),
        icon: "nc-woo-add-to-cart"
      },
      devices: "desktop",
      options: [
        {
          id: "groupProduct",
          type: "group-dev",
          options: [
            {
              id: "itemId",
              label: t("Product"),
              type: "select-dev",
              disabled: !sourceItemsHandler || sourceType === "",
              choices: {
                load: getSourceIds(sourceType, config),
                emptyLoad: {
                  title: t("There are no choices")
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 60,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeIconTab",
              label: t("Icon"),
              options: [
                {
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter-dev",
                  config: { canDelete: true }
                },
                {
                  id: "iconPosition",
                  label: t("Position"),
                  type: "radioGroup-dev",
                  disabled: iconName === "",
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "iconCustomSize",
                  label: t("Size"),
                  type: "slider-dev",
                  disabled: iconName === "",
                  config: {
                    min: 1,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  disabled: iconName === "",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
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
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
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
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "buttonColorTab",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  devices: "desktop",
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
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  devices: "desktop",
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
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "advancedSettings",
          // @ts-expect-error old option
          type: "advancedSettings",
          devices: "desktop",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
};
