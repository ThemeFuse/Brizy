import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { getSourceIds } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const _config = Config.getAll();
  const customSize = dvv("inputSize") !== "custom";
  const sourceType = Str.read(dvv("sourceType")) ?? "";
  const sourceItemsHandler = _config?.api?.sourceItems?.handler;

  return [
    {
      id: "quantity",
      type: "popover-dev",
      config: {
        icon: "nc-wp-post-excerpt",
        size: "auto",
        title: t("Context")
      },
      position: 7,
      options: [
        {
          id: "sourceID",
          type: "select-dev",
          label: t("Product"),
          devices: "desktop",
          disabled: !sourceItemsHandler || !sourceType,
          placeholder: "Select",
          choices: {
            load: getSourceIds(sourceType, _config),
            emptyLoad: {
              title: t("There are no choices")
            }
          }
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
      position: 8,
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
      id: "toolbarColor",
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
      position: 9,
      devices: "desktop",
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
                  id: "bgInputColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "inputBorder",
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
                  id: "inputBoxShadow",
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
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 10,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          position: 2,
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeIconTab",
              label: t("Icon"),
              options: [
                {
                  id: "sizeGroup",
                  type: "group-dev",
                  position: 10,
                  options: [
                    {
                      id: "inputSize",
                      label: t("Size"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "small", icon: "nc-small" },
                        { value: "medium", icon: "nc-medium" },
                        { value: "large", icon: "nc-large" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "inputWidth",
                      label: t("Width"),
                      type: "slider-dev",
                      disabled: customSize,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    },
                    {
                      id: "inputHeight",
                      label: t("Height"),
                      type: "slider-dev",
                      disabled: customSize,
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
          id: "grid",
          type: "grid-dev",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog",
                    align: "left"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
