import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device, context }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const isFrontSide = dvv("flipboxActive") === "front";
  const isBackSide = dvv("flipboxActive") === "back";

  const transition = dvv("transition");
  const transitionWithNoDirections =
    transition === "zoomIn" ||
    transition === "zoomOut" ||
    transition === "fade";
  const disableShadow = transition === "slide" || transition === "push";

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const backBgColor = getColorToolbar(
    dvv("backBgColorPalette"),
    dvv("backBgColorHex"),
    dvv("backBgColorOpacity")
  );

  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-flipbox",
        title: t("Flip Box")
      },
      position: 10,
      devices: "desktop",
      options: [
        {
          id: "trigger",
          type: "select",
          label: t("Trigger"),
          choices: [
            { title: t("Hover"), value: "hover" },
            { title: t("Click"), value: "click" }
          ]
        },
        {
          id: "transition",
          type: "select",
          label: t("Transition"),
          choices: [
            { title: t("Flip"), value: "flip" },
            { title: t("Slide"), value: "slide" },
            { title: t("Push"), value: "push" },
            { title: t("Zoom In"), value: "zoomIn" },
            { title: t("Zoom Out"), value: "zoomOut" },
            { title: t("Fade"), value: "fade" }
          ]
        },
        {
          id: "direction",
          type: "select",
          label: t("Direction"),
          disabled: transitionWithNoDirections,
          choices: [
            { title: t("Left"), value: "left" },
            { title: t("Right"), value: "right" },
            { title: t("Up"), value: "up" },
            { title: t("Down"), value: "down" }
          ]
        },
        {
          id: "speed",
          type: "slider",
          label: t("Speed"),
          config: {
            min: 100,
            max: 1000,
            units: [{ title: "ms", value: "ms" }]
          }
        }
      ]
    },
    //#region Front side options
    {
      id: "toolbarCurrentElementMedia",
      type: "popover",
      disabled: isBackSide,
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 15,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Background"),
              options: [
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload",
                  states: [NORMAL],
                  population: imageDynamicContentChoices
                }
              ]
            },
            {
              id: "filters",
              label: t("Filters"),
              options: [
                {
                  id: "",
                  type: "filters"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarFlipboxColor",
      type: "popover",
      disabled: isBackSide,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      position: 20,
      options: [
        {
          id: "tabsColorsFront",
          type: "tabs",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                {
                  id: "",
                  type: "backgroundColor"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border"
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
                  disabled: disableShadow
                }
              ]
            }
          ]
        }
      ]
    },
    //#endregion
    //#region Back side options
    {
      id: "toolbarBackCurrentElementMedia",
      type: "popover",
      disabled: isFrontSide,
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 15,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Background"),
              options: [
                {
                  label: t("Image"),
                  id: "backBg",
                  type: "imageUpload",
                  states: [NORMAL],
                  population: imageDynamicContentChoices
                }
              ]
            },
            {
              id: "filters",
              label: t("Filters"),
              options: [
                {
                  id: "back",
                  type: "filters"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarBackFlipboxColor",
      type: "popover",
      disabled: isFrontSide,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: backBgColor
          }
        }
      },
      position: 20,
      options: [
        {
          id: "tabsColorsFront",
          type: "tabs",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                {
                  id: "back",
                  type: "backgroundColor"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "backBorder",
                  type: "border"
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "backBoxShadow",
                  type: "boxShadow",
                  disabled: disableShadow
                }
              ]
            }
          ]
        }
      ]
    },
    //#endregion
    {
      id: "flipboxActive",
      type: "toggle",
      position: 30,
      choices: [
        {
          icon: "nc-switch",
          title: t("Reverse"),
          value: "front"
        },
        {
          icon: "nc-switch",
          title: t("Reverse"),
          value: "back"
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      label: t("Settings"),
      position: 40,
      options: [
        {
          id: "groupHeight",
          type: "group",
          position: 110,
          options: [
            {
              id: "heightStyle",
              label: t("Height"),
              type: "select",
              position: 110,
              choices: [
                { title: t("Auto"), value: "auto" },
                { title: t("Custom"), value: "custom" }
              ]
            },
            {
              id: "height",
              type: "slider",
              disabled: dvv("heightStyle") !== "custom",
              position: 110,
              config: {
                min: 200,
                max: 999,
                units: [{ value: "px", title: "px" }]
              }
            }
          ]
        },
        //#region Front side option
        {
          id: "verticalAlign",
          label: t("Content"),
          type: "radioGroup",
          disabled: isBackSide,
          position: 120,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" },
            { value: "between", icon: "nc-space-between" }
          ]
        },
        //#endregion
        //#region Back side option
        {
          id: "backVerticalAlign",
          label: t("Content"),
          type: "radioGroup",
          disabled: isFrontSide,
          position: 120,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" },
            { value: "between", icon: "nc-space-between" }
          ]
        },
        //#endregion
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
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
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
};
