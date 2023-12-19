import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { ToolbarItemType } from "../ToolbarItemType";
import { Value } from "./index";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { bgColorHex, bgColorHexOpacity } = v;
  return [
    {
      id: "toolbarShowHideButton",
      type: "popover-dev",
      config: {
        icon: "nc-alert",
        title: t("Alert")
      },
      position: 60,
      options: [
        {
          id: "groupShowCloseButton",
          type: "group-dev",
          devices: "desktop",
          options: [
            {
              id: "closeButtonState",
              type: "switch-dev",
              label: t("Display Close Button")
            },
            {
              id: "showCloseButtonAfter",
              label: t("Delay"),
              type: "slider-dev",
              disabled: dvv("closeButtonState") !== "on",
              config: {
                min: 0,
                max: 10,
                units: [{ title: "s", value: "s" }]
              }
            }
          ]
        },
        {
          id: "descriptionState",
          type: "switch-dev",
          label: t("Display Description"),
          devices: "desktop"
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      devices: "desktop",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, bgColorHexOpacity)
          }
        }
      },
      position: 70,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
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
                  id: "border",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "containerBoxShadow",
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
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: dvv("widthSuffix") === "px" ? 200 : 15,
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
      //@ts-expect-error Old option
      type: "advancedSettings",
      disabled: true
    }
  ];
}
