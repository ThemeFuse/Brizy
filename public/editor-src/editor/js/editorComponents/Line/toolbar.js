import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  const { hex: borderColorHex } = getOptionColor(v, "borderColor");

  return [
    {
      id: "toolbarLine",
      type: "popover",
      icon: "nc-divider",
      title: t("Line"),
      position: 80,
      options: [
        {
          id: "borderStyle",
          label: t("Style"),
          type: "radioGroup",
          choices: [
            {
              value: "solid",
              icon: "nc-solid"
            },
            {
              value: "dashed",
              icon: "nc-dashed"
            },
            {
              value: "dotted",
              icon: "nc-dotted"
            }
          ],
          value: v.borderStyle
        },
        {
          id: "borderWidth",
          label: t("Size"),
          type: "slider",
          roles: ["admin"],
          slider: {
            min: 1,
            max: 10
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: v.borderWidth
          },
          onChange: ({ value: borderWidth }) => {
            return {
              borderWidth,
              mobileBorderWidth:
                v.borderWidth === v.mobileBorderWidth
                  ? borderWidth
                  : v.mobileBorderWidth
            };
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
        }
      },
      options: [
        {
          id: "borderColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: borderColorHex,
            opacity: v.borderColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => {
            opacity =
              hex !== v.borderColorHex && v.borderColorOpacity === 0
                ? v.tempBorderColorOpacity
                : opacity;

            return {
              borderColorHex: hex,
              borderColorOpacity: opacity,
              borderColorPalette:
                isChanged === "hex" ? "" : v.borderColorPalette
            };
          }
        },
        {
          id: "borderColorPalette",
          type: "colorPalette",
          position: 20,
          value: v.borderColorPalette,
          onChange: borderColorPalette => ({
            borderColorPalette,

            borderColorOpacity:
              v.borderColorOpacity === 0
                ? v.tempBorderColorOpacity
                : v.borderColorOpacity
          })
        },
        {
          id: "borderColorFields",
          type: "colorFields",
          position: 30,
          value: {
            hex: borderColorHex,
            opacity: v.borderColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => ({
            borderColorPalette: isChanged === "hex" ? "" : v.borderColorPalette,
            borderColorHex: hex,
            borderColorOpacity: opacity
          })
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.width
          },
          onChange: ({ value: width }) => {
            return {
              width,
              mobileWidth: v.width === v.mobileWidth ? width : v.mobileWidth
            };
          }
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarLine",
      type: "popover",
      icon: "nc-divider",
      title: t("Line"),
      roles: ["admin"],
      position: 90,
      options: [
        {
          id: "mobileBorderWidth",
          label: t("Size"),
          type: "slider",
          slider: {
            min: 1,
            max: 10
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: v.mobileBorderWidth
          },
          onChange: ({ value: mobileBorderWidth }) => ({ mobileBorderWidth })
        }
      ]
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "mobileWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.mobileWidth
          },
          onChange: ({ value: mobileWidth }) => ({ mobileWidth })
        }
      ]
    }
  ];
}
