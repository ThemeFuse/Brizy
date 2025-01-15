import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { DESKTOP } from "visual/utils/responsiveMode";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";


export function getItems({ v, device, state, context, component }) {
  return defaultValueValue({ v, device, state, key: "mMenu" }) === "on"
    ? getItemsMMenu({ v, device, state, context, component })
    : getItemsSimple({ v, device, state });
}

export function getItemsSimple({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const color = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );
  const subMenuColor = getColor(
    dvv("subMenuColorPalette"),
    dvv("subMenuColorHex"),
    dvv("subMenuColorOpacity")
  );

  return [
    {
      id: "toolbarMenuSettings",
      type: "popover",
      config: {
        icon: "nc-menu-3",
        title: t("Menu")
      },
      position: 10,
      options: [
        {
          id: "menuSize",
          type: "slider",
          label: t("Size"),
          position: 20,
          disabled: dvv("verticalMode") === "horizontal",
          config: {
            min: 10,
            max: 100,
            units: [{ title: "%", value: "%" }]
          }
        }
      ]
    },
    {
      id: "toolbarMenuItem",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "iconPosition",
          label: t("Position"),
          type: "radioGroup",
          position: 10,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "iconSize",
          type: "slider",
          label: t("Size"),
          position: 20,
          config: {
            min: 0,
            max: 100,
            units: [
              {
                title: "px",
                value: "px"
              }
            ]
          }
        },
        {
          id: "iconSpacing",
          type: "slider",
          devices: "desktop",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
          config: {
            min: 0,
            max: 100,
            units: [
              {
                title: "px",
                value: "px"
              }
            ]
          }
        }
      ]
    },
    {
      id: "subMenuToolbarMenuItem",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "subMenuIconPosition",
          label: t("Position"),
          type: "radioGroup",
          position: 10,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "subMenuIconSize",
          type: "slider",
          label: t("Size"),
          position: 20,
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "subMenuIconSpacing",
          type: "slider",
          devices: "desktop",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === DESKTOP ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },
    {
      id: "subMenuToolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === DESKTOP ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "subMenu",
          type: "typography",
          config: {
            fontFamily: device === DESKTOP
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
      position: 80,
      roles: ["admin"],
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
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "bg",
              label: t("Bg"),
              options: [
                {
                  id: "menuBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "border",
              label: t("Border"),
              options: [
                {
                  id: "menuBorder",
                  type: "border",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "subMenuToolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: subMenuColor
          }
        }
      },
      devices: "desktop",
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "subMenuColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "subMenuColor",
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
                  id: "subMenuBgColor",
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
                  id: "subMenuBorder",
                  type: "border"
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
                  states: [NORMAL, HOVER, ACTIVE]
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
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      title: t("Settings")
    }
  ];
}

export function getItemsMMenu({ v, device, state, context, component }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const mMenuColor = getColor(
    dvv("mMenuColorPalette"),
    dvv("mMenuColorHex"),
    dvv("mMenuColorOpacity")
  );

  const config = component.getGlobalConfig();

  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const isExternalImage = dvv("bgImageType") !== ImageType.Internal;

  const isPointerEnabled = isBackgroundPointerEnabled(config, "menu");

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 10,
      options: [
        {
          id: "toolbarbackgroundTab",
          type: "tabs",
          tabs: [
            {
              id: "imageFilter",
              label: t("Image"),
              options: [
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload",
                  population: imageDynamicContentChoices,
                  config: {
                    disableSizes: isExternalImage,
                    pointer: !isExternalImage && isPointerEnabled
                  }
                }
              ]
            },
            {
              id: "filters",
              label: t("Filters"),
              options: [
                {
                  id: "",
                  type: "filters",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mMenuToolbarMenuItem",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "mMenuIconPosition",
          label: t("Position"),
          type: "radioGroup",
          position: 10,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "mMenuIconSize",
          type: "slider",
          label: t("Size"),
          roles: ["admin"],
          position: 20,
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "mMenuIconSpacing",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        }
      ]
    },
    {
      id: "mMenuToolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        title: t("Typography"),
        size: device === DESKTOP ? "large" : "auto"
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "mMenu",
          type: "typography",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },
    {
      id: "mMenuToolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: mMenuColor
          }
        }
      },
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "mMenuColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "mMenuColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "mMenu",
                  type: "backgroundColor"
                }
              ]
            },
            {
              id: "border",
              label: t("Border"),
              options: [
                {
                  id: "mMenuBorder",
                  type: "border"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mMenuItemHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "mMenuAdvancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      title: t("Settings")
    }
  ];
}
