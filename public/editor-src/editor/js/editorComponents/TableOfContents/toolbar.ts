import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props, State, Value } from "./types";

export const getItems: GetItems<Value, Props, State> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const bodyBg = getColor(
    dvv("bodyBgColorPalette"),
    dvv("bodyBgColorHex"),
    dvv("bodyBgColorOpacity")
  );

  return [
    {
      id: "toolbarTOC",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-table-of-contents",
        title: t("Table of Contents")
      },
      options: [
        {
          id: "tabTOCIcon",
          type: "tabs",
          tabs: [
            {
              id: "tab1",
              label: t("Contents"),
              options: [
                {
                  id: "navIcon",
                  label: t("Icon"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    {
                      value: "none",
                      title: "None",
                      icon: {
                        name: "nc-none"
                      }
                    },
                    {
                      value: "thin",
                      title: "Thin",
                      icon: {
                        name: "nc-down-arrow-thin"
                      }
                    },
                    {
                      value: "heavy",
                      title: "Heavy",
                      icon: {
                        name: "nc-down-arrow-heavy"
                      }
                    },
                    {
                      value: "tail",
                      title: "Tail",
                      icon: {
                        name: "nc-down-arrow-tail"
                      }
                    },
                    {
                      value: "filled",
                      title: "Round",
                      icon: {
                        name: "nc-down-arrow-filled"
                      }
                    },
                    {
                      value: "outline",
                      title: "Outline",
                      icon: {
                        name: "nc-down-arrow-outline"
                      }
                    }
                  ]
                },
                {
                  id: "animDuration",
                  type: "slider",
                  label: t("Duration"),
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: 2,
                    step: 0.1,
                    units: [{ value: "s", title: "s" }]
                  }
                },
                {
                  id: "minimized",
                  type: "switch",
                  label: t("Minimized")
                }
              ]
            },
            {
              id: "tab2",
              label: t("Filters"),
              options: [
                {
                  id: "selectedElements",
                  type: "multiSelect",
                  label: t("Elements"),
                  placeholder: t("0 Selected"),
                  devices: "desktop",
                  choices: [
                    { value: "h1", title: t("H1") },
                    { value: "h2", title: t("H2") },
                    { value: "h3", title: t("H3") },
                    { value: "h4", title: t("H4") },
                    { value: "h5", title: t("H5") },
                    { value: "h6", title: t("H6") }
                  ]
                },
                {
                  id: "headingsGroup",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "include",
                      type: "inputText",
                      label: t("Include"),
                      placeholder: t("Selector of container"),
                      helper: {
                        content: t(
                          "Extract headings from specific containers. Containers can be selected by CSS class name without the .dot, example: .container1, .container2"
                        )
                      }
                    },
                    {
                      id: "exclude",
                      type: "inputText",
                      label: t("Exclude"),
                      placeholder: t("Selector of container"),
                      helper: {
                        content: t(
                          "Ignore headings selection from specific containers. Containers can be selected by CSS class name without the .dot, example: .container1, .container2"
                        )
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "tab3",
              label: t("Styles"),
              options: [
                {
                  id: "markerType",
                  label: t("Marker Type"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { value: "numbers", title: t("Numbers") },
                    { value: "circle", title: t("Circle") }
                  ]
                },
                {
                  id: "markerSize",
                  label: t("Marker Size"),
                  devices: "desktop",
                  type: "slider",
                  config: {
                    min: 1,
                    max: 50,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "textUnderline",
                  label: t("Underline"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "wordWrap",
                  label: t("Word Wrap"),
                  type: "switch",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTOCColors",
      type: "popover",
      devices: "desktop",
      position: 20,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bodyBg
          }
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBg",
              label: t("Background"),
              options: [
                {
                  id: "bodyBgColor",
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
                  id: "bodyBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  config: {
                    styles: [
                      "none",
                      "solid",
                      "dashed",
                      "dotted",
                      "double",
                      "groove",
                      "ridge",
                      "inset",
                      "outset"
                    ]
                  }
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
                  states: [NORMAL, HOVER]
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
      disabled: true,
      choices: []
    }
  ];
};
