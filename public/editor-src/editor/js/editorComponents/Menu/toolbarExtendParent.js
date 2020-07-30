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
      type: "popover-dev",
      config: {
        icon: "nc-menu-3",
        title: t("Menu")
      },
      roles: ["admin"],
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
          id: "groupSettings",
          type: "group-dev",
          position: 20,
          options: [
            {
              id: "mMenu",
              type: "switch-dev",
              label: t("Make it Hamburger")
            },
            {
              id: "mMenuSize",
              type: "slider-dev",
              label: t("Size"),
              disabled: dvv("mMenu") !== "on",
              config: {
                min: 8,
                max: 64,
                units: [{ title: "px", value: "px" }]
              }
            }
          ]
        },
        {
          id: "verticalMode",
          label: t("Orientation"),
          type: "radioGroup-dev",
          position: 30,
          disabled: v.mMenu === "on",
          choices: [
            { value: "vertical", icon: "nc-vertical-items" },
            { value: "horizontal", icon: "nc-horizontal-items" }
          ]
        },
        {
          id: "mMenuPosition",
          label: t("Drawer Position"),
          type: "radioGroup",
          disabled: dvv("mMenu") === "off",
          position: 40,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ],
          value: v.mMenuPosition
        },
        {
          id: dvk("itemPadding"),
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 50,
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Color"),
        icon: {
          style: {
            backgroundColor: mMenuIconBgColor
          }
        }
      },
      position: 20,
      disabled: dvv("mMenu") === "off",
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
