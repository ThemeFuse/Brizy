import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";

export function getItems({ v, device, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const isRelative = dvv("elementPosition") === "relative";
  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

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
                      id: "padding",
                      type: "padding-dev",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "margin",
                      devices: "desktop",
                      label: t("Margin"),
                      type: "margin-dev",
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
                            min: -1200,
                            max: 1200,
                            units: [{ value: "px", title: "px" }]
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
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      type: "switch-dev",
                      position: 10,
                      closeTooltip: true
                    },
                    {
                      id: "zIndex",
                      type: "slider-dev",
                      position: 20,
                      label: t("Z-index"),
                      config: {
                        min: 0,
                        max: 100
                      }
                    },
                    {
                      id: "cssID",
                      label: t("CSS ID"),
                      type: "population-dev",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content:
                          "Add your custom ID without the #pound, example: my-id"
                      },
                      config: {
                        choices: richTextDC
                      },
                      option: {
                        id: "customID",
                        type: "inputText-dev"
                      }
                    },
                    {
                      id: "cssClass",
                      label: t("CSS Class"),
                      type: "population-dev",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content:
                          "Add your custom class without the .dot, example: my-class"
                      },
                      config: {
                        choices: richTextDC
                      },
                      option: {
                        id: "customClassName",
                        type: "inputText-dev"
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
              devices: "responsive",
              label: t("Margin"),
              type: "margin-dev",
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
                    min: -1200,
                    max: 1200,
                    units: [{ value: "px", title: "px" }]
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
