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
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs-dev",
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
                      type: "corners-dev",
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
                      type: "slider-dev",
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
                      type: "select-dev",
                      choices: [
                        { title: t("Span"), value: "span" },
                        { title: t("Div"), value: "div" },
                        { title: t("P"), value: "p" },
                        { title: t("H1"), value: "h1" },
                        { title: t("H2"), value: "h2" },
                        { title: t("H3"), value: "h3" },
                        { title: t("H4"), value: "h4" },
                        { title: t("H5"), value: "h5" },
                        { title: t("H6"), value: "h6" },
                        { title: t("PRE"), value: "pre" }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "border",
              type: "corners-dev",
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
