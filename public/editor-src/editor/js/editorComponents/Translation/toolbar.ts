import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from ".";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const color = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      devices: "desktop",
      config: {
        icon: "nc-multi-languages",
        title: t("Translation")
      },
      position: 10,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementLanguages",
              label: t("Languages"),
              options: [
                {
                  id: "showName",
                  label: t("Name"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "nameDisplay",
                  label: t("Display"),
                  type: "select",
                  devices: "desktop",
                  disabled: dvv("showName") === "off",
                  choices: [
                    { value: "full", title: t("Full Name") },
                    { value: "code", title: t("Country Code") }
                  ]
                },
                {
                  id: "textSpacing",
                  label: t("Spacing"),
                  disabled: dvv("showName") === "off",
                  type: "slider",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "tabCurrentElementFlag",
              label: t("Flag"),
              options: [
                {
                  id: "showFlags",
                  label: t("Flags"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "groupSettings",
                  type: "group",
                  disabled: dvv("showFlags") === "off",
                  options: [
                    {
                      id: "flagSize",
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
                      id: "flagCustomSize",
                      type: "slider",
                      disabled: dvv("flagSize") !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "flagSpacing",
                  label: t("Spacing"),
                  disabled: dvv("showFlags") === "off",
                  type: "slider",
                  config: {
                    min: 0,
                    max: 100,
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
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "",
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
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
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
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "boxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow",
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
      type: "popover",
      config: {
        title: t("Settings")
      },
      position: 50,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          config: {
            min: 0,
            max: 500,
            units: [{ value: "px", title: "px" }]
          }
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
              size: 1,
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
              size: 1,
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
    }
  ];
};
