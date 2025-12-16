import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";

export const getItems: GetItems = ({ v, device, context }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const isRelative = dvv("elementPosition") === "relative";
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

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
                  icon: "nc-styling",
                  position: 10,
                  options: [
                    {
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      position: 10,
                      closeTooltip: true,
                      type: "switch",
                      devices: "desktop"
                    },
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      devices: "desktop",
                      position: 50
                    },
                    {
                      id: "margin",
                      label: t("Margin"),
                      type: "margin",
                      devices: "desktop",
                      position: 60
                    },
                    {
                      id: "groupPosition",
                      type: "group",
                      options: [
                        {
                          id: "elementPosition",
                          label: t("Position"),
                          type: "select",
                          choices: [
                            { value: "relative", title: t("None") },
                            { value: "absolute", title: t("Absolute") },
                            { value: "fixed", title: t("Fixed") }
                          ]
                        },
                        {
                          id: "width",
                          label: t("Width"),
                          type: "slider",
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
                          type: "radioGroup",
                          disabled: isRelative,
                          choices: [
                            { value: "left", icon: "nc-align-left" },
                            { value: "right", icon: "nc-align-right" }
                          ]
                        },
                        {
                          id: "offsetX",
                          type: "slider",
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
                          type: "radioGroup",
                          disabled: isRelative,
                          choices: [
                            { value: "top", icon: "nc-align-top" },
                            { value: "bottom", icon: "nc-align-bottom" }
                          ]
                        },
                        {
                          id: "offsetY",
                          type: "slider",
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
                      type: "slider",
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
                      type: "codeMirror",
                      position: 45,
                      placeholder: 'key1:"value1"\nkey2:"value2"',
                      display: "block",
                      devices: "desktop",
                      helper: {
                        content: t(
                          "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
                        )
                      },
                      population: richTextDC
                    },
                    {
                      id: "cssID",
                      label: t("CSS ID"),
                      type: "population",
                      position: 30,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t(
                          "Add your custom ID without the #pound, example: my-id"
                        )
                      },
                      config: richTextDC,
                      option: {
                        id: "customID",
                        type: "inputText"
                      }
                    },
                    {
                      id: "cssClass",
                      label: t("CSS Class"),
                      type: "population",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t(
                          "Add your custom class without the .dot, example: my-class"
                        )
                      },
                      config: richTextDC,
                      option: {
                        id: "customClassName",
                        type: "inputText"
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "padding",
              type: "padding",
              label: t("Padding"),
              devices: "responsive",
              position: 50
            },
            {
              id: "margin",
              label: t("Margin"),
              type: "margin",
              devices: "responsive",
              position: 60
            },
            {
              id: "groupPosition",
              type: "group",
              devices: "responsive",
              options: [
                {
                  id: "elementPosition",
                  label: t("Position"),
                  type: "select",
                  choices: [
                    { value: "relative", title: "None" },
                    { value: "absolute", title: "Absolute" },
                    { value: "fixed", title: "Fixed" }
                  ]
                },
                {
                  id: "width",
                  label: t("Width"),
                  type: "slider",
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
                  type: "radioGroup",
                  disabled: isRelative,
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "offsetX",
                  type: "slider",
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
                  type: "radioGroup",
                  disabled: isRelative,
                  choices: [
                    { value: "top", icon: "nc-align-top" },
                    { value: "bottom", icon: "nc-align-bottom" }
                  ]
                },
                {
                  id: "offsetY",
                  type: "slider",
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
              type: "tabs",
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
                      type: "animation"
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
};
