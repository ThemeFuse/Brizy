import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: dvk("toolbarTypography"),
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: dvk("tabsTypography"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabTypographyParagraph"),
              label: t("P"),
              options: [
                {
                  id: "paragraph",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: dvk("tabTypographyH1"),
              label: t("H1"),
              options: [
                {
                  id: "h1",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: dvk("tabTypographyH2"),
              label: t("H2"),
              options: [
                {
                  id: "h2",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: dvk("tabTypographyH3"),
              label: t("H3"),
              options: [
                {
                  id: "h3",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: dvk("tabTypographyH4"),
              label: t("H4"),
              options: [
                {
                  id: "h4",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: dvk("tabTypographyH5"),
              label: t("H5"),
              options: [
                {
                  id: "h5",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: dvk("tabTypographyH6"),
              label: t("H6"),
              options: [
                {
                  id: "h6",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          value: v.tabsColor,
          tabs: [
            {
              id: "tabParagraph",
              label: t("P"),
              options: [
                {
                  id: "paragraphColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH1",
              label: t("H1"),
              options: [
                {
                  id: "h1Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH2",
              label: t("H2"),
              options: [
                {
                  id: "h2Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH3",
              label: t("H3"),
              options: [
                {
                  id: "h3Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH4",
              label: t("H4"),
              options: [
                {
                  id: "h4Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH5",
              label: t("H5"),
              options: [
                {
                  id: "h5Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH6",
              label: t("H6"),
              options: [
                {
                  id: "h6Color",
                  type: "colorPicker-dev"
                }
              ]
            }
          ]
        }
      ],
      onChange: (_, { isOpen }) => ({
        tabsState: !isOpen ? "" : v.tabsState,
        tabsColor: !isOpen ? "" : v.tabsColor
      })
    },
    {
      id: "contentHorizontalAlign",
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
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog"
    }
  ];
}
