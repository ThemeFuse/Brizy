import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";

export function getItems({
  v,
  device
}: {
  v: ElementModel;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ key, v, device });

  // Color
  const bgColorOpacity = dvv("bgColorOpacity");
  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );
  const color = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Table")
      },
      position: 50,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              position: 60,
              options: [
                {
                  id: "iconPosition",
                  label: t("Position"),
                  type: "radioGroup",
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "groupIconSize",
                  type: "group",
                  options: [
                    {
                      id: "iconSize",
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
                      id: "iconCustomSize",
                      type: "slider",
                      disabled: dvv("iconSize") !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider",
                  config: {
                    min: 0,
                    max: 50,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        title: t("Typography"),
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto"
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "typography",
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
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColorOpacity ? bgColor : color
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      devices: "desktop",
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
        title: t("Settings"),
        icon: "nc-cog"
      },
      position: 110,
      options: [
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog"
          }
        }
      ]
    }
  ];
}
