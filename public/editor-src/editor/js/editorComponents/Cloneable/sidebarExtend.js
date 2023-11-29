import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";

export function getItems({ v, device, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const isRelative = dvv("elementPosition") === "relative";
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

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
                  icon: "nc-styling",
                  position: 10,
                  options: [
                    {
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      position: 10,
                      closeTooltip: true,
                      type: "switch-dev",
                      devices: "desktop"
                    },
                    {
                      id: "padding",
                      type: "padding-dev",
                      label: t("Padding"),
                      devices: "desktop",
                      position: 50
                    },
                    {
                      id: "margin",
                      label: t("Margin"),
                      type: "margin-dev",
                      devices: "desktop",
                      position: 60
                    },
                    {
                      id: "groupPosition",
                      type: "group-dev",
                      options: [
                        {
                          id: "elementPosition",
                          label: t("Position"),
                          type: "select-dev",
                          choices: [
                            { value: "relative", title: "None" },
                            { value: "absolute", title: "Absolute" },
                            { value: "fixed", title: "Fixed" }
                          ]
                        },
                        {
                          id: "width",
                          label: t("Width"),
                          type: "slider-dev",
                          disabled: isRelative,
                          config: {
                            min: 0,
                            max: dvv("widthSuffix") === "px" ? 1200 : 100,
                            units: [
                              { value: "px", title: "px" },
                              { value: "%", title: "%" }
                            ]
                          }
                        },
                        {
                          id: "offsetXAlignment",
                          label: t("Horizontal Offset"),
                          type: "radioGroup-dev",
                          disabled: isRelative,
                          choices: [
                            { value: "left", icon: "nc-align-left" },
                            { value: "right", icon: "nc-align-right" }
                          ]
                        },
                        {
                          id: "offsetX",
                          type: "slider-dev",
                          disabled: isRelative,
                          config: {
                            min: dvv("offsetXSuffix") === "px" ? -1200 : -100,
                            max: dvv("offsetXSuffix") === "px" ? 1200 : 100,
                            units: [
                              { value: "px", title: "px" },
                              { value: "%", title: "%" }
                            ]
                          }
                        },
                        {
                          id: "offsetYAlignment",
                          label: t("Vertical Offset"),
                          type: "radioGroup-dev",
                          disabled: isRelative,
                          choices: [
                            { value: "top", icon: "nc-align-top" },
                            { value: "bottom", icon: "nc-align-bottom" }
                          ]
                        },
                        {
                          id: "offsetY",
                          type: "slider-dev",
                          disabled: isRelative,
                          config: {
                            min: dvv("offsetYSuffix") === "px" ? -1200 : -100,
                            max: dvv("offsetYSuffix") === "px" ? 1200 : 100,
                            units: [
                              { value: "px", title: "px" },
                              { value: "%", title: "%" }
                            ]
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  options: [
                    {
                      id: "zIndex",
                      type: "slider-dev",
                      position: 20,
                      label: t("Z-index"),
                      devices: "desktop",
                      config: {
                        min: 0,
                        max: 100
                      }
                    },
                    {
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror-dev",
                      position: 45,
                      // eslint-disable-next-line
                      placeholder: 'key1:"value1"\nkey2:"value2"',
                      display: "block",
                      devices: "desktop",
                      helper: {
                        content:
                          "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
                      },
                      population: richTextDC
                    }
                  ]
                }
              ]
            },
            {
              id: "padding",
              type: "padding-dev",
              label: t("Padding"),
              devices: "responsive",
              position: 50
            },
            {
              id: "margin",
              label: t("Margin"),
              type: "margin-dev",
              devices: "responsive",
              position: 60
            },
            {
              id: "groupPosition",
              type: "group-dev",
              devices: "responsive",
              options: [
                {
                  id: "elementPosition",
                  label: t("Position"),
                  type: "select-dev",
                  choices: [
                    { value: "relative", title: "None" },
                    { value: "absolute", title: "Absolute" },
                    { value: "fixed", title: "Fixed" }
                  ]
                },
                {
                  id: "width",
                  label: t("Width"),
                  type: "slider-dev",
                  disabled: isRelative,
                  config: {
                    min: 0,
                    max: dvv("widthSuffix") === "px" ? 1200 : 100,
                    units: [
                      { value: "px", title: "px" },
                      { value: "%", title: "%" }
                    ]
                  }
                },
                {
                  id: "offsetXAlignment",
                  label: t("Horizontal Offset"),
                  type: "radioGroup-dev",
                  disabled: isRelative,
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "offsetX",
                  type: "slider-dev",
                  disabled: isRelative,
                  config: {
                    min: dvv("offsetXSuffix") === "px" ? -1200 : -100,
                    max: dvv("offsetXSuffix") === "px" ? 1200 : 100,
                    units: [
                      { value: "px", title: "px" },
                      { value: "%", title: "%" }
                    ]
                  }
                },
                {
                  id: "offsetYAlignment",
                  label: t("Vertical Offset"),
                  type: "radioGroup-dev",
                  disabled: isRelative,
                  choices: [
                    { value: "top", icon: "nc-align-top" },
                    { value: "bottom", icon: "nc-align-bottom" }
                  ]
                },
                {
                  id: "offsetY",
                  type: "slider-dev",
                  disabled: isRelative,
                  config: {
                    min: dvv("offsetYSuffix") === "px" ? -1200 : -100,
                    max: dvv("offsetYSuffix") === "px" ? 1200 : 100,
                    units: [
                      { value: "px", title: "px" },
                      { value: "%", title: "%" }
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          id: "effects",
          title: t("Effects"),
          label: t("Effects"),
          options: [
            {
              id: "tabs",
              type: "tabs-dev",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "entrance",
                  position: 90,
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation-dev"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
