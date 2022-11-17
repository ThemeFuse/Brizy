import Config from "visual/global/Config";
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

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const wordpress = Boolean(Config.get("wp"));

  const categories = JSON.parse(dvv("categories"));
  const showPost = dvv("showPost");
  const showTitle = dvv("showTitle");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-wp-post-navigation",
        title: t("Post Navigation")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Settings"),
              options: [
                {
                  id: "height",
                  label: t("Separator"),
                  type: "slider-dev",
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
                  type: "slider-dev",
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
                  type: "switch-dev",
                  disabled: showPost === "off",
                  devices: "desktop"
                },
                {
                  id: "showPost",
                  label: t("Post"),
                  type: "switch-dev",
                  disabled: showTitle === "off",
                  devices: "desktop"
                },
                {
                  id: "showSeparation",
                  label: t("Separator"),
                  type: "switch-dev",
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
      type: "popover-dev",
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
          type: "multiSelect-dev",
          label: t("Categories"),
          placeholder: t("0 Selected"),
          config: {
            size: "large"
          },
          choices: getTaxonomiesMultiOptions()
        },
        {
          id: "post",
          label: t("Post"),
          type: "select-dev",
          disabled: disabledTaxonomy(categories, "post"),
          choices: getTaxonomiesMultiOptionsSub("post")
        },
        {
          id: "product",
          label: t("Product"),
          type: "select-dev",
          disabled: disabledTaxonomy(categories, "product"),
          choices: getTaxonomiesMultiOptionsSub("product")
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
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTypographyTitle",
              label: t("Label"),
              options: [
                {
                  id: "titleTypography",
                  type: "typography-dev",
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
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTitle",
              label: t("Label"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker-dev",
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
                  type: "colorPicker-dev",
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
                  type: "colorPicker-dev",
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
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
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
                  type: "sidebarTabsButton-dev",
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
