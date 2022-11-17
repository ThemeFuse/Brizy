import Config from "visual/global/Config";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  mobileSyncOnChange,
  tabletSyncOnChange
} from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";

const configMenuValue = Config.get("menuData");
const getMenuChoices = () => {
  const menus = configMenuValue.map(({ id, name }) => ({
    title: name,
    value: id
  }));

  return menus.length ? menus : [{ title: "-", value: "-" }];
};

export function getItems({ v, device }) {
  const dvk = (key) => defaultValueKey({ key, device });
  const dvv = (key) => defaultValueValue({ v, key, device });

  const menuChoices = getMenuChoices();
  const hasMenu = menuChoices.some(
    ({ value }) => value === dvv("menuSelected")
  );

  const { hex: mMenuIconColorHex } = getOptionColorHexByPalette(
    dvv("mMenuIconColorHex"),
    dvv("mMenuIconColorPalette")
  );
  const mMenuIconBgColor = hexToRgba(
    mMenuIconColorHex,
    device === "desktop"
      ? dvv("mMenuIconColorOpacity")
      : device === "tablet"
      ? tabletSyncOnChange(v, "mMenuIconColorOpacity")
      : mobileSyncOnChange(v, "mMenuIconColorOpacity")
  );

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
          value: hasMenu ? dvv("menuSelected") : "-",
          onChange: (menuSelected) => {
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
          disabled: dvv("mMenu") === "on",
          choices: [
            { value: "vertical", icon: "nc-vertical-items" },
            { value: "horizontal", icon: "nc-horizontal-items" }
          ]
        },
        {
          id: "mMenuPosition",
          label: t("Drawer Position"),
          type: "radioGroup-dev",
          disabled: dvv("mMenu") === "off",
          position: 40,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
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
            choices: [{ title: "px", value: "px" }]
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
        {
          id: "mMenuIconColor",
          type: "colorPicker-dev"
        }
      ]
    }
  ];
}
