import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { is } from "visual/utils/string/NoEmptyString";
import { Props, Value } from "./index";

const getVerticalLabel = () => {
  const verticalTranslate = is(t("Vertical")) ? t("Vertical") : "Vertical";
  return `${verticalTranslate[0]}. ${t("Space")}`;
};
const getHorizontalLabel = () => {
  const horizontalTranslate = is(t("Horizontal"))
    ? t("Horizontal")
    : "Horizontal";
  return `${horizontalTranslate[0]}. ${t("Space")}`;
};

export const getItems: GetItems<Value, Props> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const vertical = dvv("verticalMode") === "off";

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-timeline",
        title: t("Timeline")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTimeline",
              label: t("Timeline"),
              position: 40,
              options: [
                {
                  id: "verticalMode",
                  label: t("Orientation"),
                  type: "radioGroup",
                  choices: [
                    { value: "on", icon: "nc-vertical-items" },
                    { value: "off", icon: "nc-horizontal-items" }
                  ]
                },
                {
                  id: "timelineStyle",
                  label: t("Style"),
                  type: "radioGroup",
                  choices: [
                    ...(vertical
                      ? [
                          { value: "style-1", icon: "nc-timeline-style-2" },
                          { value: "style-2", icon: "nc-timeline-style-1" },
                          { value: "style-3", icon: "nc-timeline-style-3" }
                        ]
                      : [
                          { value: "style-1", icon: "nc-timeline-style-4" },
                          { value: "style-2", icon: "nc-timeline-style-5" },
                          { value: "style-3", icon: "nc-timeline-style-6" }
                        ])
                  ]
                },
                {
                  id: "enableText",
                  label: t("Titles"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "tabsCount",
                  label: t("Columns"),
                  type: "slider",
                  disabled: !vertical,
                  config: {
                    min: 1,
                    max: 6
                  }
                },
                {
                  id: "spacing",
                  label: vertical ? getVerticalLabel() : getHorizontalLabel(),
                  type: "slider",
                  config: {
                    min: 0,
                    max: 100
                  }
                },
                {
                  id: "verticalSpacing",
                  label: getVerticalLabel(),
                  disabled: vertical,
                  type: "slider",
                  config: {
                    min: 0,
                    max: 200
                  }
                },
                {
                  id: "horizontalSpacing",
                  disabled: !vertical,
                  label: getHorizontalLabel(),
                  type: "slider",
                  config: {
                    min: 0,
                    max: 200
                  }
                }
              ]
            },
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              position: 60,
              options: [
                {
                  id: "groupSize",
                  type: "group",
                  options: [
                    {
                      id: "size",
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
                      id: "customSize",
                      type: "slider",
                      disabled: dvv("size") !== "custom",
                      config: {
                        min: 14,
                        max: 180,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "iconBackground",
              label: t("Background"),
              position: 80,
              options: [
                {
                  id: "groupBorderRadius",
                  type: "group",
                  options: [
                    {
                      id: "borderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup",
                      devices: "desktop",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "borderRadius",
                      type: "slider",
                      devices: "desktop",
                      disabled: dvv("borderRadiusType") !== "custom",
                      config: {
                        min: 0,
                        max: 300,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "iconPadding",
                  label: t("Size"),
                  type: "slider",
                  config: {
                    min: 0,
                    max: 180,
                    units: [{ title: "px", value: "px" }]
                  }
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
        title: t("Colors")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "lineBorder",
              label: t("Line"),
              options: [
                {
                  id: "lineBorder",
                  type: "border",
                  config: {
                    width: ["grouped"]
                  }
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
      config: { title: t("Settings") },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: 1000,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    }
  ];
};
