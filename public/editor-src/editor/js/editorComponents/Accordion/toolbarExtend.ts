import { ElementModel } from "visual/component/Elements/Types";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  bgColorOpacity: number;

  colorHex: string;
  colorPalette: string;
  colorOpacity: number;

  navIcon: "none" | "thin" | "heavy" | "tail" | "filled" | "outline";
  navIconSize: "small" | "medium" | "large" | "custom";
}

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ key, v, device });

  const bgColorOpacity = dvv("bgColorOpacity");

  // Color
  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );
  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-toggle",
        title: t("Accordion")
      },
      position: 60,
      options: [
        {
          id: "media",
          type: "tabs",
          position: 60,
          tabs: [
            {
              id: "accordion",
              label: t("Accordion"),
              options: [
                {
                  id: "collapsible",
                  label: t("Collapsible"),
                  devices: "desktop",
                  type: "switch"
                },
                {
                  id: "animDuration",
                  type: "slider",
                  label: t("Duration"),
                  config: {
                    min: 0,
                    max: 2,
                    step: 0.1,
                    units: [{ value: "s", title: "s" }]
                  }
                },
                {
                  id: "spacing",
                  type: "slider",
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Icon"),
              position: 80,
              options: [
                {
                  id: "navIcon",
                  label: t("Icon"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    {
                      value: "none",
                      title: t("None"),
                      icon: {
                        name: "nc-none"
                      }
                    },
                    {
                      value: "thin",
                      title: t("Thin"),
                      icon: {
                        name: "nc-down-arrow-thin"
                      }
                    },
                    {
                      value: "heavy",
                      title: t("Heavy"),
                      icon: {
                        name: "nc-down-arrow-heavy"
                      }
                    },
                    {
                      value: "tail",
                      title: t("Tail"),
                      icon: {
                        name: "nc-down-arrow-tail"
                      }
                    },
                    {
                      value: "filled",
                      title: t("Round"),
                      icon: {
                        name: "nc-down-arrow-filled"
                      }
                    },
                    {
                      value: "outline",
                      title: t("Outline"),
                      icon: {
                        name: "nc-down-arrow-outline"
                      }
                    }
                  ]
                },
                {
                  id: "groupSettings",
                  type: "group",
                  disabled: dvv("navIcon") === "none",
                  options: [
                    {
                      id: "navIconSize",
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
                      id: "navIconCustomSize",
                      type: "slider",
                      disabled: dvv("navIconSize") !== "custom",
                      config: {
                        min: 8,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "tags",
              label: t("Tags"),
              position: 80,
              options: []
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
      position: 70,
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
      id: "popoverColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColorOpacity > 0 ? bgColor : color
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
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE]
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
                  states: [NORMAL, HOVER, ACTIVE]
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
                  states: [NORMAL, HOVER, ACTIVE]
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
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      title: t("Settings")
    }
  ];
};
