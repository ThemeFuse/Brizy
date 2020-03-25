import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import { toolbarColor2, toolbarColorHexField2 } from "visual/utils/toolbar";

const configMenuValue = Config.get("menuData");
const getMenuChoices = () => {
  const menus = configMenuValue.map(({ id, name }) => ({
    title: name,
    value: id
  }));

  return menus.length ? menus : [{ title: "-", value: "-" }];
};

export function getItems({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device });

  const menuChoices = getMenuChoices();
  const hasMenu = menuChoices.some(({ value }) => value === v.menuSelected);

  const mMenuSize =
    device === "desktop"
      ? v.mMenuSize
      : device === "tablet"
      ? tabletSyncOnChange(v, "mMenuSize")
      : mobileSyncOnChange(v, "mMenuSize");

  const { hex: mMenuIconColorHex } = getOptionColorHexByPalette(
    dvv("mMenuIconColorHex"),
    dvv("mMenuIconColorPalette")
  );
  const mMenuIconBgColor = hexToRgba(
    mMenuIconColorHex,
    device === "desktop"
      ? v.mMenuIconColorOpacity
      : device === "tablet"
      ? tabletSyncOnChange(v, "mMenuIconColorOpacity")
      : mobileSyncOnChange(v, "mMenuIconColorOpacity")
  );

  const mMenuIconColorOnChange =
    device === "desktop"
      ? [
          "onChangeColorHexIconMenu2",
          "onChangeColorPaletteIconMenu2",
          "onChangeColorFieldsIconMenu2"
        ]
      : device === "tablet"
      ? [
          "onChangeTabletColorHexIconMMenu2",
          "onChangeTabletColorPaletteIconMMenu2",
          "onChangeTabletColorFieldsIconMMenu2"
        ]
      : [
          "onChangeMobileColorHexIconMMenu2",
          "onChangeMobileColorPaletteIconMMenu2",
          "onChangeMobileColorFieldsIconMMenu2"
        ];

  return [
    {
      id: "toolbarMenu",
      type: "popover",
      icon: "nc-menu-3",
      roles: ["admin"],
      title: t("Menu"),
      position: 10,
      options: [
        {
          id: "menuSelected",
          type: "select",
          devices: "desktop",
          position: 10,
          label: t("Menu"),
          choices: hasMenu
            ? menuChoices
            : [{ title: t("Select a Menu"), value: "-" }, ...menuChoices],
          value: hasMenu ? v.menuSelected : "-",
          onChange: menuSelected => {
            if (menuSelected === "-") {
              return;
            }

            return { menuSelected };
          }
        },
        {
          type: "multiPicker",
          position: 20,
          picker: {
            id: dvk("mMenu"),
            label: t("Make it Hamburger"),
            type: "switch",
            value: dvv("mMenu")
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
                  value: mMenuSize
                },
                onChange: ({ value }) => ({
                  [dvk("mMenuSize")]: value
                })
              }
            ]
          }
        },
        {
          id: "mMenuPosition",
          label: t("Drawer Position"),
          type: "radioGroup",
          roles: ["admin"],
          devices: "desktop",
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
          id: dvk("itemPadding"),
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
          disabled: v.items.length === 1 || dvv("mMenu") === "on",
          value: {
            value: dvv("itemPadding")
          },
          onChange: ({ value }) => {
            return {
              [dvk("itemPadding")]: value,
              [dvk("itemPaddingRight")]: value,
              [dvk("itemPaddingLeft")]: value
            };
          }
        }
      ]
    },
    {
      id: "mMenuColors",
      type: "popover",
      size: "auto",
      title: t("Color"),
      position: 20,
      disabled: dvv("mMenu") === "off",
      icon: {
        style: {
          backgroundColor: mMenuIconBgColor
        }
      },
      options: [
        toolbarColor2({
          v,
          device,
          state,
          prefix: dvk("mMenuIconColor"),
          onChangeHex: [mMenuIconColorOnChange[0]],
          onChangePalette: [mMenuIconColorOnChange[1]]
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
                  state,
                  prefix: dvk("mMenuIconColor"),
                  onChange: [mMenuIconColorOnChange[2]]
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}
