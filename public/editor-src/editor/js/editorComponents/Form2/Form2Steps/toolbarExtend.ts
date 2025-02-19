import { Str } from "@brizy/readers";
import type { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import {
  isViewType,
  isViewTypeWithIcon,
  isViewTypeWithNumber
} from "visual/editorComponents/Form2/utils";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props } from "./types";

const getColorLabel = (viewType: string): string => {
  if (isViewType(viewType)) {
    if (isViewTypeWithIcon(viewType)) {
      return t("Icon");
    }

    if (isViewTypeWithNumber(viewType)) {
      return t("Number");
    }
  }

  return "";
};

export const getItems: GetItems<ElementModel, Props> = ({
  v,
  device,
  component
}) => {
  const dvv = (key: string) => defaultValueValue({ key, v, device });

  const viewType = Str.read(component.props.viewType) ?? "";
  const iconSize = dvv("iconSize");

  const isText = viewType === "text";
  const isIcon = viewType === "icon";
  const isNumber = viewType === "number";
  const isProgress = viewType === "progressBar";
  const isNumberText = viewType === "number-text";
  const isIconText = viewType === "icon-text";

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  return [
    {
      id: "toolbarFormStep",
      type: "popover",
      config: {
        icon: "nc-form-left",
        title: t("Form")
      },
      position: 10,
      options: [
        {
          id: "toolbarSteps",
          type: "tabs",
          tabs: [
            {
              id: "tabsIcon",
              label: t("Icon"),
              options: [
                {
                  id: "iconSizeGroup",
                  type: "group",
                  disabled: !isIcon && !isIconText,
                  options: [
                    {
                      id: "iconSize",
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
                      id: "iconCustomSize",
                      type: "slider",
                      disabled: iconSize !== "custom",
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "textSpacing",
                  type: "slider",
                  label: t("Spacing"),
                  disabled: !isNumberText && !isIconText
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      position: 20,
      disabled: isIcon,
      config: {
        icon: "nc-font",
        size: "auto",
        title: t("Typography")
      },
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
      position: 30,
      devices: "desktop",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabNumber",
              label: getColorLabel(viewType),
              options: [
                {
                  id: "numberColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE],
                  disabled: isText || isProgress
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "textColor",
                  type: "colorPicker",
                  states: isProgress
                    ? [NORMAL, HOVER]
                    : [NORMAL, HOVER, ACTIVE],
                  disabled: isNumber || isIcon
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
                  states: [NORMAL, HOVER, ACTIVE],
                  disabled: isProgress
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE],
                  disabled: isProgress
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
                  states: isProgress ? [NORMAL, HOVER] : [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabProgressBg",
              label: t("Bg"),
              position: 10,
              options: [
                {
                  id: "progressBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: !isProgress
                }
              ]
            },
            {
              id: "tabProgress",
              label: t("Progress"),
              position: 20,
              options: [
                {
                  id: "progressColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: !isProgress
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
      position: 40,
      options: [
        {
          id: "dividerWidth",
          type: "slider",
          label: t("D. Height"),
          disabled: isProgress,
          config: {
            min: 1,
            max: 50,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "dividerIndent",
          type: "slider",
          label: t("D. Indent"),
          disabled: isProgress,
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        },

        {
          id: "progressHeight",
          type: "slider",
          label: t("Height"),
          disabled: !isProgress,
          config: {
            min: 1,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          disabled: isProgress,
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
};
