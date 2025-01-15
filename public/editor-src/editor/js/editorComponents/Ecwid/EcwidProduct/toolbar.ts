import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEcwidProducts } from "visual/utils/api";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { EcwidProductColumns, Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state, component }) => {
  const config = component.getGlobalConfig();

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
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
      type: "popover",
      config: { title: t("Product"), icon: "nc-woo-related-products" },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Product"),
              options: [
                {
                  id: "productId",
                  type: "select",
                  label: t("Product"),
                  choices: {
                    load: () => getEcwidProducts(config),
                    emptyLoad: {
                      title: t("There are no choices")
                    }
                  }
                },
                {
                  id: "columns",
                  label: t("Columns"),
                  type: "select",
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
                  type: "select",
                  choices: [
                    { title: "Below image", value: "belowImage" },
                    { title: "Beside image", value: "besideImage" }
                  ]
                },
                {
                  id: "between",
                  label: t("Between"),
                  type: "slider",
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
                  type: "switch"
                },
                {
                  id: "nameFirstMobile",
                  disabled: dvv("nameDisplay") === "off",
                  label: t("Name - First on Mobile"),
                  type: "switch",
                  helper: {
                    content:
                      "The product name always shows on top on the mobile version."
                  }
                },
                {
                  id: "skuDisplay",
                  label: t("SKU"),
                  type: "switch"
                },
                {
                  id: "priceDisplay",
                  label: t("Price"),
                  type: "switch"
                },
                {
                  id: "subtitleDisplay",
                  label: t("Subtitle"),
                  type: "switch"
                },
                {
                  id: "optionsDisplay",
                  label: t("Options"),
                  type: "switch"
                },
                {
                  id: "stockLabelDisplay",
                  label: t("Stock Availability labels"),
                  type: "switch"
                },
                {
                  id: "numberInStockDisplay",
                  label: t("Number of items in stock"),
                  type: "switch"
                },
                {
                  id: "quantityDisplay",
                  label: t("Quantity"),
                  type: "switch"
                },
                {
                  id: "wholesalePricesDisplay",
                  label: t("Wholesale Prices"),
                  type: "switch"
                },
                {
                  id: "attributesDisplay",
                  label: t("Attributes"),
                  type: "switch"
                },
                {
                  id: "weightDisplay",
                  label: t("Weight"),
                  type: "switch"
                },
                {
                  id: "descriptionOptions",
                  type: "group",
                  options: [
                    {
                      id: "descriptionDisplay",
                      label: t("Description"),
                      type: "switch"
                    },
                    {
                      id: "cutProductDescription",
                      label: t("Cut description"),
                      disabled:
                        description ||
                        position ||
                        threeColumnsRight ||
                        threeColumnsLeft,
                      type: "switch",
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
                  type: "switch"
                }
              ]
            },
            {
              id: "tabCurrentElementShareButtons",
              label: t("Buttons"),
              options: [
                {
                  id: "groupShareButtons",
                  type: "group",
                  options: [
                    {
                      id: "shareButtonsDisplay",
                      label: t("Share Buttons"),
                      type: "switch"
                    },
                    {
                      id: "showFacebookShareBtn",
                      label: t("Facebook"),
                      type: "switch",
                      disabled: disableShareBtn
                    },
                    {
                      id: "showPinterestShareBtn",
                      label: t("Pinterest"),
                      type: "switch",
                      disabled: disableShareBtn
                    },
                    {
                      id: "showTwitterShareBtn",
                      label: t("Twitter"),
                      type: "switch",
                      disabled: disableShareBtn
                    },
                    {
                      id: "showVkShareBtn",
                      label: t("VK"),
                      type: "switch",
                      disabled: disableShareBtn
                    }
                  ]
                },
                {
                  id: "favoritesButtonsDisplay",
                  label: t("Favorites Buttons"),
                  type: "switch"
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
      position: 20,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "product",
                  type: "backgroundColor",
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
                  type: "border",
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
                  type: "boxShadow",
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
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 20,
      devices: "desktop",
      title: t("Settings")
    }
  ];
};
