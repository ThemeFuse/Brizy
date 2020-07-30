import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { t } from "visual/utils/i18n";

export default menus => {
  const menuList = menus.map(item => ({
    title: item.name,
    value: TARGET === "WP" ? item.slug : item.id
  }));

  return {
    getItems: getItems(menuList)
  };
};

const getItems = menuList => ({ v, device }) => {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      position: 60,
      config: {
        icon: "nc-menu-3"
      },
      options: [
        {
          id: "toggleMenu",
          type: "switch-dev",
          label: t("Toggle Menu"),
          devices: "responsive"
        },
        {
          id: "menuName",
          label: t("Menu"),
          devices: "desktop",
          type: "select-dev",
          choices: menuList
        },
        {
          id: "itemPadding",
          label: t("Spacing"),
          type: "slider-dev",
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
      type: "popover-dev",
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
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      roles: ["admin"],
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "color",
          type: "colorPicker-dev",
          states: [NORMAL, HOVER, ACTIVE]
        }
      ]
    },
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      position: 150
    }
  ];
};
