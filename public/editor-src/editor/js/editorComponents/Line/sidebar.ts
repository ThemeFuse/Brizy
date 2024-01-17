import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ToolbarItemType } from "../ToolbarItemType";
import { Value } from "./index";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  options: [
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      devices: "desktop"
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      devices: "desktop",
                      position: 100,
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
                    },
                    {
                      id: "tagName",
                      label: t("HTML Tag"),
                      disabled: dvv("style") !== "text",
                      devices: "desktop",
                      type: "select",
                      choices: [
                        { title: "Span", value: "span" },
                        { title: "Div", value: "div" },
                        { title: "P", value: "p" },
                        { title: "H1", value: "h1" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                        { title: "H5", value: "h5" },
                        { title: "H6", value: "h6" },
                        { title: "PRE", value: "pre" }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "border",
              type: "corners",
              label: t("Corner"),
              position: 65,
              devices: "responsive"
            }
          ]
        }
      ]
    }
  ];
}
