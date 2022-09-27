import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { EcwidProductColumns, Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const columns = dvv("columns");

  const threeColumnsRight = columns === EcwidProductColumns.ThreeRight;
  const threeColumnsLeft = columns === EcwidProductColumns.ThreeLeft;
  const twoColumnsRight = columns !== EcwidProductColumns.TwoRight;

  const disableShareBtn = dvv("shareButtonsDisplay") === "off";
  const description = dvv("descriptionDisplay") === "off";
  const position = dvv("descriptionPosition") === "besideImage";

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: { title: t("Product"), icon: "nc-woo-related-products" },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Product"),
              options: [
                {
                  id: "columns",
                  label: t("Columns"),
                  type: "select-dev",
                  choices: [
                    {
                      title: "Two columns on the left",
                      value: EcwidProductColumns.TwoLeft
                    },
                    {
                      title: "Two columns on the right",
                      value: EcwidProductColumns.TwoRight
                    },
                    {
                      title: "Three columns on the right",
                      value: EcwidProductColumns.ThreeRight
                    },
                    {
                      title: "Three columns on the left",
                      value: EcwidProductColumns.ThreeLeft
                    }
                  ]
                },
                {
                  id: "descriptionPosition",
                  label: t("Description"),
                  disabled: twoColumnsRight,
                  type: "select-dev",
                  choices: [
                    { title: "Below image", value: "belowImage" },
                    { title: "Beside image", value: "besideImage" }
                  ]
                },
                {
                  id: "between",
                  label: t("Between"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "tabCurrentElementDisplay",
              label: t("Display"),
              options: [
                {
                  id: "nameDisplay",
                  label: t("Name"),
                  type: "switch-dev"
                },
                {
                  id: "nameFirstMobile",
                  disabled: dvv("nameDisplay") === "off",
                  label: t("Name - First on Mobile"),
                  type: "switch-dev",
                  helper: {
                    content:
                      "The product name always shows on top on the mobile version."
                  }
                },
                {
                  id: "breadcrumbsDisplay",
                  label: t("Breadcrumbs"),
                  type: "switch-dev"
                },
                {
                  id: "skuDisplay",
                  label: t("SKU"),
                  type: "switch-dev"
                },
                {
                  id: "priceDisplay",
                  label: t("Price"),
                  type: "switch-dev"
                },
                {
                  id: "subtitleDisplay",
                  label: t("Subtitle"),
                  type: "switch-dev"
                },
                {
                  id: "optionsDisplay",
                  label: t("Options"),
                  type: "switch-dev"
                },
                {
                  id: "stockLabelDisplay",
                  label: t("Stock Availability labels"),
                  type: "switch-dev"
                },
                {
                  id: "numberInStockDisplay",
                  label: t("Number of items in stock"),
                  type: "switch-dev"
                },
                {
                  id: "quantityDisplay",
                  label: t("Quantity"),
                  type: "switch-dev"
                },
                {
                  id: "wholesalePricesDisplay",
                  label: t("Wholesale Prices"),
                  type: "switch-dev"
                },
                {
                  id: "attributesDisplay",
                  label: t("Attributes"),
                  type: "switch-dev"
                },
                {
                  id: "weightDisplay",
                  label: t("Weight"),
                  type: "switch-dev"
                },
                {
                  id: "descriptionOptions",
                  type: "group-dev",
                  options: [
                    {
                      id: "descriptionDisplay",
                      label: t("Description"),
                      type: "switch-dev"
                    },
                    {
                      id: "cutProductDescription",
                      label: t("Cut description"),
                      disabled:
                        description ||
                        position ||
                        threeColumnsRight ||
                        threeColumnsLeft,
                      type: "switch-dev",
                      helper: {
                        content:
                          'Cuts long product description and displays only one paragraph and "Show more" link to see full info.'
                      }
                    }
                  ]
                },
                {
                  id: "footerDisplay",
                  label: t("Footer"),
                  type: "switch-dev"
                }
              ]
            },
            {
              id: "tabCurrentElementShareButtons",
              label: t("Buttons"),
              options: [
                {
                  id: "groupShareButtons",
                  type: "group-dev",
                  options: [
                    {
                      id: "shareButtonsDisplay",
                      label: t("Share Buttons"),
                      type: "switch-dev"
                    },
                    {
                      id: "showFacebookShareBtn",
                      label: t("Facebook"),
                      type: "switch-dev",
                      disabled: disableShareBtn
                    },
                    {
                      id: "showPinterestShareBtn",
                      label: t("Pinterest"),
                      type: "switch-dev",
                      disabled: disableShareBtn
                    },
                    {
                      id: "showTwitterShareBtn",
                      label: t("Twitter"),
                      type: "switch-dev",
                      disabled: disableShareBtn
                    },
                    {
                      id: "showVkShareBtn",
                      label: t("VK"),
                      type: "switch-dev",
                      disabled: disableShareBtn
                    }
                  ]
                },
                {
                  id: "favoritesButtonsDisplay",
                  label: t("Favorites Buttons"),
                  type: "switch-dev"
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
      position: 20,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "product",
                  type: "backgroundColor-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "productBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productBoxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      // @ts-expect-error old option
      type: "advancedSettings",
      position: 20,
      devices: "desktop",
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
