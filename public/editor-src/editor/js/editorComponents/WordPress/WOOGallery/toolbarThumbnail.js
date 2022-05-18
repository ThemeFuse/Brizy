import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("thumbnailBorderColorHex"),
    dvv("thumbnailBorderColorPalette")
  );

  const spacingLabel =
    v.thumbStyle === "bottom"
      ? t("Top")
      : v.thumbStyle === "top"
      ? t("Bottom")
      : v.thumbStyle === "left"
      ? t("Right")
      : t("Left");

  return [
    {
      id: "toolbarWOOGalleryThumbnail",
      type: "popover-dev",
      position: 10,
      config: {
        icon: "nc-woo-gallery"
      },
      options: [
        {
          id: "groupThumbStyle",
          type: "group-dev",
          options: [
            {
              id: "thumbStyle",
              label: t("Style"),
              type: "radioGroup-dev",
              devices: "desktop",
              choices: [
                { value: "bottom", icon: "nc-woo-gallery-bottom" },
                { value: "left", icon: "nc-woo-gallery-left" },
                { value: "top", icon: "nc-woo-gallery-top" },
                { value: "right", icon: "nc-woo-gallery-right" }
              ]
            },
            {
              id: "thumbWidth",
              label: t("Width"),
              type: "slider-dev",
              disabled: v.thumbStyle !== "left" && v.thumbStyle !== "right",
              config: {
                min: 0,
                max: 200,
                units: [{ value: "px", title: "px" }]
              }
            }
          ]
        },
        {
          id: "spacing",
          label: spacingLabel,
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "thumbPerRowTB",
          label: t("Columns"),
          type: "slider-dev",
          devices: "desktop",
          disabled: v.thumbStyle !== "top" && v.thumbStyle !== "bottom",
          config: {
            min: 2,
            max: 8
          }
        },
        {
          id: "thumbPerRowRL",
          label: t("Columns"),
          type: "slider-dev",
          devices: "desktop",
          disabled: v.thumbStyle !== "left" && v.thumbStyle !== "right",
          config: {
            min: 1,
            max: 8
          }
        },
        {
          id: "betweenThumbnail",
          label: t("Between"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
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
              borderColorHex,
              dvv("thumbnailBorderColorOpacity")
            )
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "thumbnailBorder",
                  type: "border-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "thumbnailBoxShadow",
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
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
}
