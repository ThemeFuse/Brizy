import Config from "visual/global/Config";
import { getSourceIds } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const sourceType = dvv("sourceType");

  const config = Config.getAll();
  const sourceItemsHandler = config?.api?.sourceItems?.handler;

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("paragraphColorHex"),
    dvv("paragraphColorPalette")
  );

  return [
    {
      id: "posts",
      type: "popover-dev",
      config: {
        icon: "nc-wp-post-excerpt",
        size: "auto",
        title: t("Context")
      },
      position: 70,
      options: [
        {
          id: "sourceID",
          type: "select-dev",
          label: t("Source"),
          disabled: !sourceItemsHandler,
          devices: "desktop",
          placeholder: "Select",
          choices: {
            load: getSourceIds(sourceType, config),
            emptyLoad: {
              title: t("There are no choices")
            }
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
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTypographyParagraph",
              label: "P",
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
              id: "tabTypographyH1",
              label: "H1",
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
              id: "tabTypographyH2",
              label: "H2",
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
              id: "tabTypographyH3",
              label: "H3",
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
              id: "tabTypographyH4",
              label: "H4",
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
              id: "tabTypographyH5",
              label: "H5",
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
              id: "tabTypographyH6",
              label: "H6",
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
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabParagraph",
              label: "P",
              options: [
                {
                  id: "paragraphColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH1",
              label: "H1",
              options: [
                {
                  id: "h1Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH2",
              label: "H2",
              options: [
                {
                  id: "h2Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH3",
              label: "H3",
              options: [
                {
                  id: "h3Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH4",
              label: "H4",
              options: [
                {
                  id: "h4Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH5",
              label: "H5",
              options: [
                {
                  id: "h5Color",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabH6",
              label: "H6",
              options: [
                {
                  id: "h6Color",
                  type: "colorPicker-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "contentHorizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
}
