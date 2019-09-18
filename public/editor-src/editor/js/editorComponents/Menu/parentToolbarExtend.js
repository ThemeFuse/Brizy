import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarColor2,
  toolbarColorHexField2,
  toolbarCustomCSS
} from "visual/utils/toolbar";

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
  const device = "desktop";

  const { hex: mMenuIconColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "mMenuIconColorHex", device }),
    defaultValueValue({ v, key: "mMenuIconColorPalette", device })
  );

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
        toolbarColor2({
          v,
          device,
          prefix: "mMenuIconColor",
          state: "normal",
          onChangeHex: ["onChangeColorHexIconMenu2"],
          onChangePalette: ["onChangeColorPaletteIconMenu2"]
        }),
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                toolbarColorHexField2({
                  v,
                  device,
                  prefix: "mMenuIconColor",
                  state: "normal",
                  onChange: ["onChangeColorFieldsIconMenu2"]
                })
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
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: "settingsStyling",
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: []
            },
            {
              id: "moreSettingsAdvanced",
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: [toolbarCustomCSS({ v })]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";
  const state = "normal";

  const { hex: tabletMMenuIconColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "mMenuIconColorHex", device }),
    defaultValueValue({ v, key: "mMenuIconColorPalette", device })
  );
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
        toolbarColor2({
          v,
          device,
          prefix: "tabletMMenuIconColor",
          state,
          onChangeHex: ["onChangeTabletColorHexIconMMenu2"],
          onChangePalette: ["onChangeTabletColorPaletteIconMMenu2"]
        }),
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                toolbarColorHexField2({
                  v,
                  device,
                  prefix: "tabletMMenuIconColor",
                  state,
                  onChange: ["onChangeTabletColorFieldsIconMMenu2"]
                })
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
  const device = "mobile";
  const state = "normal"

  const { hex: mobileMMenuIconColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "mMenuIconColorHex", device }),
    defaultValueValue({ v, key: "mMenuIconColorPalette", device })
  );
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
        toolbarColor2({
          v,
          device,
          prefix: "mobileMMenuIconColor",
          state,
          onChangeHex: ["onChangeMobileColorHexIconMMenu2"],
          onChangePalette: ["onChangeMobileColorPaletteIconMMenu2"]
        }),
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                toolbarColorHexField2({
                  v,
                  device,
                  prefix: "mobileMMenuIconColor",
                  state,
                  onChange: ["onChangeMobileColorFieldsIconMMenu2"]
                })
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
