import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

const configMenuValue = Config.get("menuData");
const getMenuChoices = () => {
  const menus = configMenuValue.map(({ id, name }) => ({
    title: name,
    value: id
  }));

  return menus.length ? menus : [{ title: "-", value: "-" }];
};
const getMenu = ({ menuSelected }) => {
  const menuChoices = getMenuChoices();
  const hasMenu = menuChoices.some(({ value }) => value === menuSelected);

  return [
    {
      id: "menuSelected",
      type: "select",
      label: t("WP Menu"),
      position: 10,
      choices: hasMenu
        ? menuChoices
        : [{ title: t("Select a Menu"), value: "-" }, ...menuChoices],
      value: hasMenu ? menuSelected : "-",
      onChange: menuSelected => {
        if (menuSelected === "-") {
          return;
        }

        return { menuSelected };
      }
    }
  ];
};

export function getItemsForDesktop(v) {
  const { hex: mMenuIconColorHex } = getOptionColor(v, "mMenuIconColor");

  return [
    {
      id: "toolbarMenu",
      type: "popover",
      icon: "nc-menu-3",
      roles: ["admin"],
      title: t("WP Menu"),
      position: 10,
      options: [
        ...getMenu(v),
        {
          type: "multiPicker",
          position: 20,
          picker: {
            id: "mMenu",
            label: t("Make it Hamburger"),
            type: "switch",
            value: v.mMenu
          },
          choices: {
            on: [
              {
                id: "mMenuSize",
                type: "slider",
                label: t("Size"),
                roles: ["admin"],
                slider: {
                  min: 8,
                  max: 64
                },
                input: {
                  show: true
                },
                suffix: {
                  show: true,
                  choices: [
                    {
                      title: "px",
                      value: "px"
                    }
                  ]
                },
                value: {
                  value: v.mMenuSize
                },
                onChange: ({ value: mMenuSize }) => ({ mMenuSize })
              }
            ]
          }
        },
        {
          id: "mMenuPosition",
          label: t("Drawer Position"),
          type: "radioGroup",
          roles: ["admin"],
          disabled: v.mMenu === "off",
          choices: [
            {
              value: "left",
              icon: "nc-align-left"
            },
            {
              value: "right",
              icon: "nc-align-right"
            }
          ],
          value: v.mMenuPosition
        },
        {
          id: "itemPadding",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 30,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          disabled: v.items.length === 1 || v.mMenu === "on",
          value: {
            value: v.itemPadding
          },
          onChange: ({ value: itemPadding }) => {
            return {
              itemPadding,
              itemPaddingRight: itemPadding,
              itemPaddingLeft: itemPadding
            };
          }
        }
      ]
    },
    {
      id: "toolbarMMenuIconColor",
      type: "popover",
      size: "auto",
      title: t("Color"),
      position: 20,
      disabled: v.mMenu === "off",
      icon: {
        style: {
          backgroundColor: hexToRgba(mMenuIconColorHex, v.mMenuIconColorOpacity)
        }
      },
      options: [
        {
          id: "mMenuIconColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: mMenuIconColorHex,
            opacity: v.mMenuIconColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => {
            const mMenuIconColorOpacity =
              hex !== v.mMenuIconColorHex && v.mMenuIconColorOpacity === 0
                ? v.mMenuTempIconColorOpacity
                : opacity;

            return {
              mMenuIconColorHex: hex,
              mMenuIconColorOpacity: mMenuIconColorOpacity,
              mMenuIconColorPalette:
                isChanged === "hex" ? "" : v.mMenuIconColorPalette
            };
          }
        },
        {
          id: "mMenuIconColorPalette",
          type: "colorPalette",
          position: 20,
          value: v.mMenuIconColorPalette,
          onChange: mMenuIconColorPalette => ({
            mMenuIconColorPalette,
            mMenuIconColorHex: "",
            mMenuIconColorOpacity:
              v.mMenuIconColorOpacity === 0
                ? v.mMenuTempIconColorOpacity
                : v.mMenuIconColorOpacity
          })
        },
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                {
                  id: "mMenuIconColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: mMenuIconColorHex,
                    opacity: v.mMenuIconColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    const mMenuIconColorOpacity =
                      hex !== v.mMenuIconColorHex &&
                      v.mMenuIconColorOpacity === 0
                        ? v.mMenuTempIconColorOpacity
                        : opacity;

                    return {
                      mMenuIconColorPalette:
                        isChanged === "hex" ? "" : v.mMenuIconColorPalette,
                      mMenuIconColorHex: hex,
                      mMenuIconColorOpacity: mMenuIconColorOpacity
                    };
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
      ],
      value: v.horizontalAlign
    }
  ];
}

export function getItemsForTablet(v) {
  const { hex: tabletMMenuIconColorHex } =
    v.tabletMMenuIconColorHex !== null
      ? getOptionColor(v, "tabletMMenuIconColor")
      : getOptionColor(v, "mMenuIconColor");

  return [
    {
      id: "tabletToolbarMenu",
      type: "popover",
      icon: "nc-menu-3",
      roles: ["admin"],
      title: t("WP Menu"),
      position: 10,
      options: [
        ...getMenu(v),
        {
          type: "multiPicker",
          picker: {
            id: "tabletMMenu",
            label: t("Make it Hamburger"),
            type: "switch",
            value: v.tabletMMenu
          },
          choices: {
            on: [
              {
                id: "tabletMMenuSize",
                type: "slider",
                label: t("Size"),
                roles: ["admin"],
                slider: {
                  min: 8,
                  max: 64
                },
                input: {
                  show: true
                },
                suffix: {
                  show: true,
                  choices: [
                    {
                      title: "px",
                      value: "px"
                    }
                  ]
                },
                value: {
                  value: tabletSyncOnChange(v, "mMenuSize")
                },
                onChange: ({ value: tabletMMenuSize }) => ({ tabletMMenuSize })
              }
            ]
          }
        },
        {
          id: "mMenuPosition",
          label: t("Drawer Position"),
          type: "radioGroup",
          roles: ["admin"],
          disabled: v.tabletMMenu === "off",
          choices: [
            {
              value: "left",
              icon: "nc-align-left"
            },
            {
              value: "right",
              icon: "nc-align-right"
            }
          ],
          value: v.mMenuPosition
        },
        {
          id: "tabletItemPadding",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          disabled: v.items.length === 1 || v.tabletMMenu === "on",
          value: {
            value: v.tabletItemPadding
          },
          onChange: ({ value: tabletItemPadding }) => {
            return {
              tabletItemPadding,
              tabletItemPaddingRight: tabletItemPadding,
              tabletItemPaddingLeft: tabletItemPadding
            };
          }
        }
      ]
    },
    {
      id: "tabletMMenuColors",
      type: "popover",
      size: "auto",
      title: t("Color"),
      position: 20,
      disabled: v.tabletMMenu === "off",
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletMMenuIconColorHex,
            tabletSyncOnChange(v, "mMenuIconColorOpacity")
          )
        }
      },
      options: [
        {
          id: "tabletMMenuIconColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: tabletMMenuIconColorHex,
            opacity: tabletSyncOnChange(v, "mMenuIconColorOpacity")
          },
          onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
            const tabletMMenuIconColorOpacity =
              hex !== v.tabletMMenuIconColorHex &&
              v.tabletMMenuIconColorOpacity === 0
                ? v.mMenuTempIconColorOpacity
                : opacity;

            return {
              tabletMMenuIconColorHex: hex,
              tabletMMenuIconColorOpacity: tabletMMenuIconColorOpacity,
              tabletMMenuIconColorPalette:
                isChanged === "hex" ? "" : v.tabletMMenuIconColorPalette
            };
          }
        },
        {
          id: "tabletMMenuIconColorPalette",
          type: "colorPalette",
          position: 20,
          value: tabletSyncOnChange(v, "mMenuIconColorPalette"),
          onChange: tabletMMenuIconColorPalette => ({
            tabletMMenuIconColorPalette,
            tabletMMenuIconColorHex: "",
            tabletMMenuIconColorOpacity:
              v.tabletMMenuIconColorOpacity === 0
                ? v.mMenuTempIconColorOpacity
                : v.tabletMMenuIconColorOpacity
          })
        },
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                {
                  id: "tabletMMenuIconColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: tabletMMenuIconColorHex,
                    opacity: tabletSyncOnChange(v, "mMenuIconColorOpacity")
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    const tabletMMenuIconColorOpacity =
                      hex !== v.tabletMMenuIconColorHex &&
                      v.tabletMMenuIconColorOpacity === 0
                        ? v.mMenuTempIconColorOpacity
                        : opacity;

                    return {
                      tabletMMenuIconColorPalette:
                        isChanged === "hex"
                          ? ""
                          : v.tabletMMenuIconColorPalette,
                      tabletMMenuIconColorHex: hex,
                      tabletMMenuIconColorOpacity: tabletMMenuIconColorOpacity
                    };
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "tabletHorizontalAlign",
      type: "toggle",
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
      ],
      value: tabletSyncOnChange(v, "horizontalAlign")
    }
  ];
}

export function getItemsForMobile(v) {
  const { hex: mobileMMenuIconColorHex } =
    v.mobileMMenuIconColorHex !== null
      ? getOptionColor(v, "mobileMMenuIconColor")
      : getOptionColor(v, "mMenuIconColor");

  return [
    {
      id: "mobileToolbarMenu",
      type: "popover",
      icon: "nc-menu-3",
      roles: ["admin"],
      title: t("WP Menu"),
      position: 10,
      options: [
        ...getMenu(v),
        {
          type: "multiPicker",
          picker: {
            id: "mobileMMenu",
            label: t("Make it Hamburger"),
            type: "switch",
            value: v.mobileMMenu
          },
          choices: {
            on: [
              {
                id: "mobileMMenuSize",
                type: "slider",
                label: t("Size"),
                roles: ["admin"],
                slider: {
                  min: 8,
                  max: 64
                },
                input: {
                  show: true
                },
                suffix: {
                  show: true,
                  choices: [
                    {
                      title: "px",
                      value: "px"
                    }
                  ]
                },
                value: {
                  value: mobileSyncOnChange(v, "mMenuSize")
                },
                onChange: ({ value: mobileMMenuSize }) => ({ mobileMMenuSize })
              }
            ]
          }
        },
        {
          id: "mMenuPosition",
          label: t("Drawer Position"),
          type: "radioGroup",
          roles: ["admin"],
          disabled: v.mobileMMenu === "off",
          choices: [
            {
              value: "left",
              icon: "nc-align-left"
            },
            {
              value: "right",
              icon: "nc-align-right"
            }
          ],
          value: v.mMenuPosition
        },
        {
          id: "mobileItemPadding",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          disabled: v.items.length === 1 || v.mobileMMenu === "on",
          value: {
            value: v.mobileItemPadding
          },
          onChange: ({ value: mobileItemPadding }) => {
            return {
              mobileItemPadding,
              mobileItemPaddingRight: mobileItemPadding,
              mobileItemPaddingLeft: mobileItemPadding
            };
          }
        }
      ]
    },
    {
      id: "mobileMMenuColors",
      type: "popover",
      size: "auto",
      title: t("Color"),
      position: 20,
      disabled: v.mobileMMenu === "off",
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileMMenuIconColorHex,
            mobileSyncOnChange(v, "mMenuIconColorOpacity")
          )
        }
      },
      options: [
        {
          id: "mobileMMenuIconColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: mobileMMenuIconColorHex,
            opacity: mobileSyncOnChange(v, "mMenuIconColorOpacity")
          },
          onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
            const mobileMMenuIconColorOpacity =
              hex !== v.mobileMMenuIconColorHex &&
              v.mobileMMenuIconColorOpacity === 0
                ? v.mMenuTempIconColorOpacity
                : opacity;

            return {
              mobileMMenuIconColorHex: hex,
              mobileMMenuIconColorOpacity: mobileMMenuIconColorOpacity,
              mobileMMenuIconColorPalette:
                isChanged === "hex" ? "" : v.mobileMMenuIconColorPalette
            };
          }
        },
        {
          id: "mobileMMenuIconColorPalette",
          type: "colorPalette",
          position: 20,
          value: mobileSyncOnChange(v, "mMenuIconColorPalette"),
          onChange: mobileMMenuIconColorPalette => ({
            mobileMMenuIconColorPalette,
            mobileMMenuIconColorHex: "",
            mobileMMenuIconColorOpacity:
              v.mobileMMenuIconColorOpacity === 0
                ? v.mMenuTempIconColorOpacity
                : v.mobileMMenuIconColorOpacity
          })
        },
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                {
                  id: "mobileMMenuIconColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: mobileMMenuIconColorHex,
                    opacity: mobileSyncOnChange(v, "mMenuIconColorOpacity")
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    const mobileMMenuIconColorOpacity =
                      hex !== v.mobileMMenuIconColorHex &&
                      v.mobileMMenuIconColorOpacity === 0
                        ? v.mMenuTempIconColorOpacity
                        : opacity;

                    return {
                      mobileMMenuIconColorPalette:
                        isChanged === "hex"
                          ? ""
                          : v.mobileMMenuIconColorPalette,
                      mobileMMenuIconColorHex: hex,
                      mobileMMenuIconColorOpacity: mobileMMenuIconColorOpacity
                    };
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileHorizontalAlign",
      type: "toggle",
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
      ],
      value: mobileSyncOnChange(v, "horizontalAlign")
    }
  ];
}
