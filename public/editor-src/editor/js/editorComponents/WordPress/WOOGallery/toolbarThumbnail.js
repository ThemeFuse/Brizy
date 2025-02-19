import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const borderColor = getColorToolbar(
    dvv("thumbnailBorderColorPalette"),
    dvv("thumbnailBorderColorHex"),
    dvv("thumbnailBorderColorOpacity")
  );

  const thumbStyle = dvv("thumbStyle");

  const leftThumbStyle = thumbStyle === "left";
  const rightThumbStyle = thumbStyle !== "right";
  const bottomThumbStyle = thumbStyle === "bottom";
  const topThumbStyle = thumbStyle === "top";

  const spacingLabel = bottomThumbStyle
    ? t("Top")
    : topThumbStyle
      ? t("Bottom")
      : leftThumbStyle
        ? t("Right")
        : t("Left");

  return [
    {
      id: "toolbarWOOGalleryThumbnail",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-woo-gallery"
      },
      options: [
        {
          id: "groupThumbStyle",
          type: "group",
          options: [
            {
              id: "thumbStyle",
              label: t("Style"),
              type: "radioGroup",
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
              type: "slider",
              disabled: !leftThumbStyle && rightThumbStyle,
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
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "thumbPerRowTB",
          label: t("Columns"),
          type: "slider",
          devices: "desktop",
          disabled: topThumbStyle && bottomThumbStyle,
          config: {
            min: 2,
            max: 8
          }
        },
        {
          id: "thumbPerRowRL",
          label: t("Columns"),
          type: "slider",
          devices: "desktop",
          disabled: !leftThumbStyle && rightThumbStyle,
          config: {
            min: 1,
            max: 8
          }
        },
        {
          id: "betweenThumbnail",
          label: t("Between"),
          type: "slider",
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
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: borderColor
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "thumbnailBorder",
                  type: "border",
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
                  type: "boxShadow",
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
      devices: "desktop"
    }
  ];
}
