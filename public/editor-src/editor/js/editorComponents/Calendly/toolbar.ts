import { WithEditorMode, isStory } from "visual/global/EditorModeContext";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { ToolbarItemType } from "../ToolbarItemType";
import { calendlySelector, getSizeCSSFn } from "./css";
import { Value } from "./index";

export function getItems({
  v,
  device,
  editorMode
}: {
  v: Value;
  device: ResponsiveMode;
} & WithEditorMode): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const _isStory = isStory(editorMode);

  return [
    {
      id: "toolbarCalendly",
      type: "popover",
      position: 90,
      devices: "desktop",
      config: {
        icon: "nc-calendly",
        title: t("Calendly")
      },
      options: [
        {
          id: "link",
          type: "inputText",
          label: t("Link"),
          placeholder: "https://calendly.com/user/event"
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
            backgroundColor: hexToRgba(dvv("bgColorHex"), dvv("bgColorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Background"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: calendlySelector
                }
              ]
            },
            {
              id: "tabLine",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: calendlySelector
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: calendlySelector
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "toolbarSettings",
      type: "popover",
      position: 110,
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          },
          style: getSizeCSSFn("width")
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          config: {
            min: 150,
            max: 1000,
            units: [{ value: "px", title: "px" }]
          },
          style: getSizeCSSFn("height")
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
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
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
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
      type: "sidebarTabsButton",
      disabled: !_isStory,
      position: 110
    }
  ];
}
