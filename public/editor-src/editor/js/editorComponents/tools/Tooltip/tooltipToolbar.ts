import { ElementModel } from "visual/component/Elements/Types";
import { Params } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export const getItems = <
  M extends ElementModel = ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>
>({
  v,
  device
}: Params<M, P>): ToolbarItemType[] => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

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
            backgroundColor: color
          }
        }
      },
      devices: "desktop",
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
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "tooltipTextColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "tooltipBorder",
                  type: "border"
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "tooltipBoxShadow",
                  type: "boxShadow"
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
      ]
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
          }
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
          }
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
