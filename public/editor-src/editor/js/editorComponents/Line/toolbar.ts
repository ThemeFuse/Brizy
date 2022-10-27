import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";
import { Value } from "./index";

const getColorLaber = (style: string) => {
  switch (style) {
    case "text":
      return t("Text");
    case "icon":
      return t("Icon");
    case "default":
      return "";
  }
};

export function getItems({
  v,
  device,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const IS_STORY = isStory(Config.getAll());

  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });
  const { style } = v;

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-divider",
        title: t("Style")
      },
      position: 60,
      options: [
        {
          id: "style",
          label: t("Style"),
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "default", icon: "nc-line-solid" },
            { value: "text", icon: "nc-line-text" },
            { value: "icon", icon: "nc-line-icon" }
          ]
        },
        {
          id: "iconImage",
          label: t("Icon"),
          //@ts-expect-error New option doesn't work
          type: "iconSetter",
          devices: "desktop",
          disabled: style !== "icon",
          value: {
            name: v.iconName,
            type: v.iconType
          },
          onChange: ({ name, type }: { name: string; type: string }) => ({
            iconName: name,
            iconType: type
          })
        },
        {
          id: "horizontalAlign",
          label: t("Align"),
          type: "radioGroup-dev",
          devices: "desktop",
          disabled: style === "default",
          choices: [
            { value: "left", icon: "nc-line-align-left" },
            { value: "center", icon: "nc-line-align-center" },
            { value: "right", icon: "nc-line-align-right" }
          ]
        },
        {
          id: "iconSize",
          type: "slider-dev",
          label: t("Size"),
          disabled: style !== "icon",
          config: {
            min: 8,
            max: 50,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "spacing",
          type: "slider-dev",
          label: t("Spacing"),
          disabled: style === "default",
          config: {
            units: [{ value: "px", title: "px" }]
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
      disabled: style !== "text",
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid-dev",
          columns: [
            {
              id: "col-1",
              align: "center",
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
              id: "col-2",
              align: "center",
              options: [
                {
                  id: "text",
                  devices: "desktop",
                  type: "population-dev",
                  config: {
                    iconOnly: true,
                    choices: richTextDC
                  }
                }
              ]
            }
          ]
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
            backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
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
              id: "tabText",
              label: getColorLaber(style),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  disabled: style === "default"
                }
              ]
            },
            {
              id: "tabLine",
              label: t("Line"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  config: {
                    width: ["grouped"],
                    styles: [
                      "solid",
                      "dashed",
                      "dotted",
                      "double",
                      "groove",
                      "ridge",
                      "inset",
                      "outset"
                    ]
                  }
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
      disabled: IS_STORY,
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "grid",
          type: "grid-dev",
          config: {
            separator: true
          },
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
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      //@ts-expect-error old option
      type: "advancedSettings",
      icon: "nc-cog",
      disabled: !IS_STORY,
      position: 110
    }
  ];
}
