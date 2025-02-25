import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isStory } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { ProgressStyle, Value } from "./types";

export const getItems: GetItems<Value> = ({
  v,
  device,
  context,
  editorMode
}) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const progressBarStyle = dvv("progressBarStyle");
  const showText = dvv("showText");
  const showPercentage = dvv("showPercentage");

  const style2 = progressBarStyle === ProgressStyle.Style2;
  const percentageOff = showPercentage === "off";
  const textOff = showText === "off";

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const _isStory = isStory(editorMode);

  return [
    {
      id: "toolbarProgressBar",
      type: "popover",
      config: {
        title: t("Progress"),
        icon: "nc-progress-bar"
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "progressBarStyle",
          label: t("Style"),
          type: "radioGroup",
          choices: [
            { value: ProgressStyle.Style1, icon: "nc-progress-bar-style-1" },
            { value: ProgressStyle.Style2, icon: "nc-progress-bar-style-2" }
          ]
        },
        {
          id: "percentage",
          label: t("Fill"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            inputMax: 100,
            size: "short",
            units: [{ value: "%", title: "%" }]
          },
          population: richTextDC
        },
        {
          id: "showText",
          type: "switch",
          label: t("Title"),
          disabled: style2
        },
        {
          id: "showPercentage",
          type: "switch",
          label: t("Percentage")
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          config: {
            showSingle: true
          },
          tabs: [
            {
              id: "tabText",
              label: t("Title"),
              options: [
                {
                  id: "gridTypography",
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
                          id: "typography",
                          type: "typography",
                          config: {
                            fontFamily: "desktop" === device
                          },
                          disabled: textOff || style2
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "auto",
                      align: "center",
                      options: [
                        {
                          id: "text",
                          type: "population",
                          config: {
                            ...richTextDC,
                            iconOnly: true
                          },
                          devices: "desktop",
                          disabled:
                            textOff || style2 || richTextDC === undefined
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabPercent",
              label: t("Percent"),
              options: [
                {
                  id: "gridTypography",
                  type: "grid",
                  config: {
                    separator: true
                  },
                  disabled: percentageOff,
                  columns: [
                    {
                      id: "col-1",
                      size: 1,
                      options: [
                        {
                          id: "",
                          type: "typography",
                          config: {
                            fontFamily: "desktop" === device
                          }
                        }
                      ]
                    },
                    {
                      id: "col-2",
                      size: "auto",
                      align: "center",
                      options: [
                        {
                          id: "percentage",
                          type: "population",
                          config: {
                            ...richTextDC,
                            iconOnly: true
                          },
                          disabled: richTextDC === undefined,
                          devices: "desktop"
                        }
                      ]
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
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
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
              label: t("Title"),
              options: [
                {
                  id: "labelColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: textOff || style2
                }
              ]
            },
            {
              id: "tabPercent",
              label: t("Percent"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: percentageOff
                }
              ]
            },
            {
              id: "tabBar",
              label: t("Bar"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bg2Color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
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
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      disabled: _isStory,
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          position: 100,
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "style1Height",
          label: t("Height"),
          type: "slider",
          disabled: style2,
          config: {
            min: 10,
            max: 200,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "style2Height",
          label: t("Height"),
          type: "slider",
          disabled: progressBarStyle === ProgressStyle.Style1,
          config: {
            min: 10,
            max: 200,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          config: { separator: true },
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
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: !_isStory,
      position: 110,
      devices: "desktop"
    }
  ];
};
