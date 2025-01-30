import { ElementModel } from "visual/component/Elements/Types";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export interface Value extends ElementModel {
  closeColorHex: string;
  closeColorPalette: string;
  closeColorOpacity: number;
}

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const closeColor = getColorToolbar(
    dvv("closeColorPalette"),
    dvv("closeColorHex"),
    dvv("closeColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "toolbarCurrentElementTabs",
          type: "tabs",
          tabs: [
            {
              id: "toolbarCurrentElementTabClose",
              label: t("Icon"),
              options: [
                {
                  id: "closeHorizontalPosition",
                  label: t("Lateral"),
                  type: "slider",
                  config: {
                    min: -50,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "closeVerticalPosition",
                  label: t("Vertical"),
                  type: "slider",
                  config: {
                    min: -50,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "groupCloseSize",
                  type: "group",
                  options: [
                    {
                      id: "closeSize",
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
                      id: "closeCustomSize",
                      type: "slider",
                      disabled: dvv("closeSize") !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "toolbarCurrentElementTabBackground",
              label: t("Background"),
              options: [
                {
                  id: "closeBgSize",
                  label: t("Size"),
                  type: "slider",
                  config: {
                    min: 0,
                    max: 30,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "groupCloseBorderRadiusShape",
                  type: "group",
                  options: [
                    {
                      id: "closeBorderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "closeBorderRadius",
                      type: "slider",
                      disabled: dvv("closeBorderRadiusType") !== "custom",
                      config: {
                        min: 0,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
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
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: closeColor
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "closeColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "closeBgColor",
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
      id: "closePosition",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-position-in", value: "inside", title: "" },
        { icon: "nc-position-out", value: "outside", title: "" }
      ]
    },
    {
      id: "closeAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-align-top-left", value: "topLeft", title: "" },
        { icon: "nc-align-top-right", value: "topRight", title: "" },
        { icon: "nc-align-bottom-right", value: "bottomRight", title: "" },
        { icon: "nc-align-bottom-left", value: "bottomLeft", title: "" }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      devices: "desktop",
      title: t("Settings")
    }
  ];
};
