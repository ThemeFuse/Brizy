import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Patch, Value } from "../types";
import { handleChangeTooltip } from "../utils/dependencies";

type OnChangeCallback = (value: Patch) => void;

const getItems =
  (onChange: OnChangeCallback): GetItems<Value> =>
  ({ v, device }) => {
    const dvv = (key: string) => defaultValueValue({ v, key, device });

    const dependencies = (data: Value) =>
      v.textPopulation ? data : onChange(handleChangeTooltip(data, v));

    const color = getColorToolbar(
      dvv("tooltipBgColorPalette"),
      dvv("tooltipBgColorHex"),
      dvv("tooltipBgColorOpacity")
    );

    return [
      {
        id: "toolbarTypography",
        type: "popover",
        config: {
          icon: "nc-font",
          size: device === "desktop" ? "large" : "auto",
          title: t("Typography")
        },
        position: 70,
        options: [
          {
            id: "tooltipTypography",
            type: "typography",
            config: {
              fontFamily: device === "desktop"
            },
            dependencies
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
              backgroundColor: color
            }
          }
        },
        roles: ["admin"],
        position: 80,
        options: [
          {
            id: "tabsColor",
            type: "tabs",
            tabs: [
              {
                id: "tabBg",
                label: t("Bg"),
                options: [
                  {
                    id: "tooltip",
                    type: "backgroundColor",
                    dependencies
                  }
                ]
              },
              {
                id: "tabText",
                label: t("Text"),
                options: [
                  {
                    id: "tooltipTextColor",
                    type: "colorPicker",
                    dependencies
                  }
                ]
              },
              {
                id: "tabBorder",
                label: t("Border"),
                options: [
                  {
                    id: "tooltipBorder",
                    type: "border",
                    dependencies
                  }
                ]
              },
              {
                id: "tabShadow",
                label: t("Shadow"),
                options: [
                  {
                    id: "tooltipBoxShadow",
                    type: "boxShadow",
                    dependencies
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "tooltipHorizontalAlign",
        type: "toggle",
        choices: [
          { icon: "nc-text-align-left", title: t("Align"), value: "left" },
          { icon: "nc-text-align-center", title: t("Align"), value: "center" },
          { icon: "nc-text-align-right", title: t("Align"), value: "right" }
        ],
        dependencies
      },
      {
        id: "toolbarSettings",
        type: "popover",
        config: {
          title: t("Settings")
        },
        options: [
          {
            id: "tooltipWidth",
            label: t("Width"),
            type: "slider",
            config: {
              min: 50,
              max: 500,
              units: [{ title: "px", value: "px" }]
            },
            dependencies
          },
          {
            id: "tooltipOffset",
            label: t("Offset"),
            type: "slider",
            devices: "desktop",
            config: {
              min: 0,
              max: 100,
              inputMin: 0,
              inputMax: 100,
              units: [{ title: "px", value: "px" }]
            },
            dependencies
          },
          {
            id: "styles",
            type: "sidebarTabsButton",
            devices: "desktop",
            config: {
              tabId: "styles",
              text: t("Styling"),
              icon: "nc-cog",
              align: "left"
            }
          }
        ]
      }
    ];
  };

export default function (onChange: OnChangeCallback) {
  return { getItems: getItems(onChange) };
}
