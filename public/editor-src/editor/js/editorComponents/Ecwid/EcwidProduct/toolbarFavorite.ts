import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const favoriteBgColor = getColor(
    dvv("favoriteBgColorPalette"),
    dvv("favoriteBgColorHex"),
    dvv("favoriteBgColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementButton",
              label: t("Button"),
              options: [
                {
                  id: "groupSize",
                  type: "group",
                  options: [
                    {
                      id: "favoriteSize",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-small" },
                        { value: "medium", icon: "nc-medium" },
                        { value: "large", icon: "nc-large" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "favoriteHeight",
                      label: t("Height"),
                      disabled: dvv("favoriteSize") !== "custom",
                      type: "slider",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    },
                    {
                      id: "favoriteWidth",
                      label: t("Width"),
                      disabled: dvv("favoriteSize") !== "custom",
                      type: "slider",
                      config: {
                        min: 0,
                        max: 100,
                        units: [
                          { value: "%", title: "%" },
                          { value: "px", title: "px" }
                        ]
                      }
                    }
                  ]
                },
                {
                  id: "favoriteRightSpacing",
                  label: t("Spacing"),
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
              id: "tabCurrentElementIcon",
              label: t("Icon"),
              options: [
                {
                  id: "groupSize",
                  type: "group",
                  options: [
                    {
                      id: "groupSizeFavorite",
                      type: "group",
                      options: [
                        {
                          id: "favoriteIconSize",
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
                          id: "favoriteIconCustomSize",
                          type: "slider",
                          disabled: dvv("favoriteIconSize") !== "custom",
                          config: {
                            min: 8,
                            max: 50,
                            units: [{ title: "px", value: "px" }]
                          }
                        }
                      ]
                    },
                    {
                      id: "favoriteRightIconSpacing",
                      label: t("Spacing"),
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
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      position: 20,
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      options: [
        {
          id: "favoriteTypography",
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
      position: 30,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: favoriteBgColor
          }
        }
      },
      devices: "desktop",
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
                  id: "favoriteColor",
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
                  id: "favorite",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "favoriteBorder",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "favoriteBoxShadow",
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
      id: "favoriteHorizontalAlign",
      type: "toggle",
      position: 40,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 50,
      options: [
        {
          id: "favoriteSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
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
