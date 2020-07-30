import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import {
  getTaxonomiesMultiOptions,
  getTaxonomiesMultiOptionsSub
} from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";

import { NORMAL, HOVER } from "visual/utils/stateMode";

const disabledTaxonomy = (arr, taxonomy = "") =>
  !arr.some(elem => taxonomy === elem);

export function getItems({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const wordpress = Boolean(Config.get("wp"));

  const categories = JSON.parse(v.categories);

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-wp-shortcode",
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
                  disabled: v.showPost === "off" || v.showTitle === "off",
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
                  disabled: v.showPost === "off",
                  devices: "desktop"
                },
                {
                  id: "showPost",
                  label: t("Post"),
                  type: "switch-dev",
                  disabled: v.showTitle === "off",
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
          placeholder: "Categories",
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
            backgroundColor: hexToRgba(v.bgColorHex, v.bgColorOpacity)
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
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
