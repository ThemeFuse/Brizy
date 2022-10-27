import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { DESKTOP } from "visual/utils/responsiveMode";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state, context }) {
  return defaultValueValue({ v, device, state, key: "mMenu" }) === "on"
    ? getItemsMMenu({ v, device, state, context })
    : getItemsSimple({ v, device, state });
}
export function getItemsSimple({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );
  const { hex: subMenuColorHex } = getOptionColorHexByPalette(
    dvv("subMenuColorHex"),
    dvv("subMenuColorPalette")
  );

  return [
    {
      id: "toolbarMenuSettings",
      type: "popover-dev",
      config: {
        icon: "nc-menu-3",
        title: t("Menu")
      },
      position: 10,
      options: [
        {
          id: "menuSize",
          type: "slider-dev",
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
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "iconPosition",
          label: t("Position"),
          type: "radioGroup-dev",
          position: 10,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "iconSize",
          type: "slider-dev",
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
          type: "slider-dev",
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
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "subMenuIconPosition",
          label: t("Position"),
          type: "radioGroup-dev",
          position: 10,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "subMenuIconSize",
          type: "slider-dev",
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
          id: "subMenuIconSpacing",
          type: "slider-dev",
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
      id: "toolbarTypography",
      type: "popover-dev",
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
          type: "typography-dev",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },
    {
      id: "subMenuToolbarTypography",
      type: "popover-dev",
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
          type: "typography-dev",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },

    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
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
                  type: "colorPicker-dev",
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
                  type: "border-dev",
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(subMenuColorHex, v.subMenuColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "subMenuColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "subMenuColor",
                  type: "colorPicker-dev",
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
                  type: "colorPicker-dev",
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
                  type: "border-dev"
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
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
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}

export function getItemsMMenu({ v, device, state, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const { hex: mMenuColorHex } = getOptionColorHexByPalette(
    dvv("mMenuColorHex"),
    dvv("mMenuColorPalette")
  );

  const imageDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.image
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 10,
      options: [
        {
          id: "toolbarbackgroundTab",
          type: "tabs-dev",
          tabs: [
            {
              id: "imageFilter",
              label: t("Image"),
              options: [
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
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
                  type: "filters-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mMenuToolbarMenuItem",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "mMenuIconPosition",
          label: t("Position"),
          type: "radioGroup-dev",
          position: 10,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "mMenuIconSize",
          type: "slider-dev",
          label: t("Size"),
          roles: ["admin"],
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
          id: "mMenuIconSpacing",
          type: "slider-dev",
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
      id: "mMenuToolbarTypography",
      type: "popover-dev",
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
          type: "typography-dev",
          config: {
            fontFamily: device === DESKTOP
          }
        }
      ]
    },
    {
      id: "mMenuToolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(mMenuColorHex, v.mMenuColorOpacity)
          }
        }
      },
      position: 80,
      roles: ["admin"],
      options: [
        {
          id: "mMenuColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "mMenuColor",
                  type: "colorPicker-dev",
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
                  type: "backgroundColor-dev"
                }
              ]
            },
            {
              id: "border",
              label: t("Border"),
              options: [
                {
                  id: "mMenuBorder",
                  type: "border-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mMenuItemHorizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    },
    {
      id: "mMenuAdvancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
