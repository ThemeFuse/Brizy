import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { hoverEffects } from "visual/utils/options/Animation/utils";
import { read as readString } from "visual/utils/string/specs";
import { GetItems } from "../EditorComponent/types";

export const getItems: GetItems = ({ v, device, context }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const isRelative = dvv("elementPosition") === "relative";
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const hoverName = readString(dvv("hoverName")) ?? "none";

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
                      type: "switch",
                      position: 10,
                      closeTooltip: true,
                      preserveId: true
                    },
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "margin",
                      devices: "desktop",
                      label: t("Margin"),
                      type: "margin",
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
                      id: "zIndex",
                      type: "slider",
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
                      type: "population",
                      position: 40,
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
                    },
                    {
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror",
                      position: 45,
                      placeholder: 'key1:"value1"\nkey2:"value2"',
                      display: "block",
                      helper: {
                        content: t(
                          "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
                        )
                      },
                      population: richTextDC
                    }
                  ]
                }
              ]
            },
            {
              id: "settingsTabsResponsive",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "responsive",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  position: 10,
                  options: [
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      devices: "responsive",
                      position: 50
                    },
                    {
                      id: "margin",
                      devices: "responsive",
                      label: t("Margin"),
                      type: "margin",
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
                            min: -1200,
                            max: 1200,
                            units: [{ value: "px", title: "px" }]
                          }
                        }
                      ]
                    }
                  ]
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
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation"
                    }
                  ]
                },
                {
                  id: "tabHover",
                  label: t("Hover"),
                  options: [
                    {
                      id: "hover",
                      type: "animation",
                      devices: "desktop",
                      config: {
                        types: hoverEffects,
                        replay: false,
                        infiniteAnimation: hasInfiniteAnimation(hoverName),
                        delay: false
                      }
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
