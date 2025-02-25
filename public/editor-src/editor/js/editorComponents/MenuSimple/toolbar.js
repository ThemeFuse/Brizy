import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export default (menus) => {
  const menuList = menus.map((item) => ({
    title: item.name,
    value: TARGET === "WP" ? item.slug : item.id
  }));

  return {
    getItems: getItems(menuList)
  };
};

const getItems =
  (menuList) =>
  ({ v, device }) => {
    const dvv = (key) => defaultValueValue({ v, key, device });

    const color = getColorToolbar(
      dvv("colorPalette"),
      dvv("colorHex"),
      dvv("colorOpacity")
    );

    return [
      {
        id: "toolbarCurrentElement",
        type: "popover",
        position: 60,
        config: {
          icon: "nc-menu-3"
        },
        options: [
          {
            id: "toggleMenu",
            type: "switch",
            label: t("Toggle Menu"),
            devices: "responsive"
          },
          {
            id: "menuName",
            label: t("Menu"),
            devices: "desktop",
            type: "select",
            choices: menuList
          },
          {
            id: "itemPadding",
            label: t("Spacing"),
            type: "slider",
            config: {
              min: 1,
              max: 100,
              units: [{ value: "px", title: "px" }]
            }
          }
        ]
      },
      {
        id: "toolbarTypography",
        type: "popover",
        config: {
          icon: "nc-font",
          size: device === "desktop" ? "large" : "auto",
          title: t("Typography")
        },
        roles: ["admin"],
        position: 70,
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
        config: {
          title: t("Colors"),
          size: "auto",
          icon: {
            style: {
              backgroundColor: color
            }
          }
        },
        roles: ["admin"],
        position: 80,
        devices: "desktop",
        options: [
          {
            id: "color",
            type: "colorPicker",
            states: [NORMAL, HOVER]
          }
        ]
      },
      {
        id: "advancedSettings",
        type: "advancedSettings",
        devices: "desktop",
        position: 150
      }
    ];
  };
