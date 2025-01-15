import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getTaxonomiesMultiOptions,
  getTaxonomiesMultiOptionsSub
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

const disabledTaxonomy = (arr, taxonomy = "") =>
  !arr.some((elem) => taxonomy === elem);

export function getItems({ v, device, state, component }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const wordpress = !!component.getGlobalConfig().wp;

  const categories = JSON.parse(dvv("categories"));
  const showPost = dvv("showPost");
  const showTitle = dvv("showTitle");
  const { postTypesTaxs } = component.getGlobalConfig();

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-wp-post-navigation",
        title: t("Post Navigation")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Settings"),
              options: [
                {
                  id: "height",
                  label: t("Separator"),
                  type: "slider",
                  devices: "desktop",
                  config: {
                    min: 50,
                    max: 150,
                    units: [{ value: "%", title: "%" }]
                  }
                },
                {
                  id: "spacing",
                  label: t("Spacing"),
                  type: "slider",
                  disabled: showPost === "off" || showTitle === "off",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "showTitle",
                  label: t("Label"),
                  type: "switch",
                  disabled: showPost === "off",
                  devices: "desktop"
                },
                {
                  id: "showPost",
                  label: t("Post"),
                  type: "switch",
                  disabled: showTitle === "off",
                  devices: "desktop"
                },
                {
                  id: "showSeparation",
                  label: t("Separator"),
                  type: "switch",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "dynamicToolbarCarousel",
      type: "popover",
      config: {
        icon: "nc-dynamic",
        title: t("Dynamic Content")
      },
      roles: ["admin"],
      devices: "desktop",
      disabled: !wordpress,
      position: 80,
      options: [
        {
          id: "categories",
          type: "multiSelect",
          label: t("Categories"),
          placeholder: t("0 Selected"),
          config: {
            size: "large"
          },
          choices: getTaxonomiesMultiOptions(postTypesTaxs)
        },
        {
          id: "post",
          label: t("Post"),
          type: "select",
          disabled: disabledTaxonomy(categories, "post"),
          choices: getTaxonomiesMultiOptionsSub(postTypesTaxs, "post")
        },
        {
          id: "product",
          label: t("Product"),
          type: "select",
          disabled: disabledTaxonomy(categories, "product"),
          choices: getTaxonomiesMultiOptionsSub(postTypesTaxs, "product")
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
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabTypographyTitle",
              label: t("Label"),
              options: [
                {
                  id: "titleTypography",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabTypographyPost",
              label: t("Post"),
              options: [
                {
                  id: "postTypography",
                  type: "typography",
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
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(dvv("bgColorHex"), dvv("bgColorOpacity"))
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabTitle",
              label: t("Label"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker",
                  disabled: dvv("showTitle") === "off",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabPost",
              label: t("Post"),
              options: [
                {
                  id: "postColor",
                  type: "colorPicker",
                  disabled: dvv("showTitle") === "off",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabSeparation",
              label: t("Separator"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  disabled: dvv("showSeparation") === "off",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
