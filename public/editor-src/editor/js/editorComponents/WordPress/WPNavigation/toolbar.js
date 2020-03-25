import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export default menus => {
  const menuList = menus.map(item => ({ title: item.name, value: item.slug }));

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
      id: "toolbarWPNavigation",
      type: "popover",
      icon: "nc-wp-shortcode",
      position: 60,
      options: [
        {
          id: dvk("toggleMenu"),
          label: t("Toggle Menu"),
          devices: "responsive",
          type: "switch",
          value: v.tabletToggleMenu
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
      type: "popover",
      roles: ["admin"],
      icon: "nc-font",
      size: "large",
      title: t("Typography"),
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev"
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      title: t("Colors"),
      size: "auto",
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "color",
          type: "colorPicker-dev"
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
