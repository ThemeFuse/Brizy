import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { getSourceIds } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import * as Str from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types";

//@ts-expect-error Old option
export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgThroughPriceColorHex"),
    dvv("bgThroughPriceColorPalette")
  );

  const _config = Config.getAll();
  const sourceItemsHandler = _config?.api?.sourceItems?.handler;
  const sourceType = Str.read(dvv("sourceType")) ?? "";

  return [
    {
      id: "price",
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
          label: t("Source"),
          devices: "desktop",
          disabled: !sourceItemsHandler,
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
          id: "typographyThroughPrice",
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
            backgroundColor: hexToRgba(
              bgColorHex,
              dvv("bgThroughPriceColorOpacity")
            )
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
                  id: "bgThroughPriceColor",
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
                  id: "textColorThroughPrice",
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
                  id: "throughPriceBorder",
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
                  id: "priceThroughSBoxShadow",
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
      type: "advancedSettings",
      devices: "desktop",
      position: 100,
      title: t("Settings"),
      icon: "nc-cog"
    }
  ];
};
