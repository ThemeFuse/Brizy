import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

const getMenuChoices = (menuSelected, menuData) => {
  if (menuData.length === 0) return [{ title: t("Missing Menus"), value: "" }];
  const menus = menuData.map(({ id, name }) => ({
    title: name,
    value: id
  }));

  const hasMenu = menus.some(({ value }) => value === menuSelected);
  return hasMenu ? menus : [{ title: t("Select a Menu"), value: "" }, ...menus];
};

export function getItems({ v, device, component }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const menuSelected = dvv("menuSelected");

  const mMenuIconColor = getColor(
    dvv("mMenuIconColorPalette"),
    dvv("mMenuIconColorHex"),
    dvv("mMenuIconColorOpacity")
  );

  return [
    {
      id: "toolbarMenu",
      type: "popover",
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
          choices: getMenuChoices(
            menuSelected,
            component.getGlobalConfig().menuData
          )
        },
        {
          id: "groupSettings",
          type: "group",
          position: 20,
          options: [
            {
              id: "mMenu",
              type: "switch",
              label: t("Make it Hamburger")
            },
            {
              id: "mMenuSize",
              type: "slider",
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
          type: "radioGroup",
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
          type: "radioGroup",
          disabled: dvv("mMenu") === "off",
          position: 40,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "closeDrawerIcon",
          type: "switch",
          disabled: dvv("mMenu") === "off",
          label: t("Close Drawer Icon")
        },
        {
          id: "itemPadding",
          type: "slider",
          label: t("Spacing"),
          roles: ["admin"],
          position: 50,
          disabled: v.items.length === 1 || dvv("mMenu") === "on",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "mMenuColors",
      type: "popover",
      config: {
        size: "auto",
        title: t("Color"),
        icon: {
          style: {
            backgroundColor: mMenuIconColor
          }
        }
      },
      position: 20,
      disabled: dvv("mMenu") === "off",
      options: [
        {
          id: "mMenuIconColor",
          type: "colorPicker"
        }
      ]
    }
  ];
}
