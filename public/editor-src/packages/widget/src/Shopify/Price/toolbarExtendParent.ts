import { Value } from "widget/Shopify/Price/types";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";

export const getItems: GetItems<Value> = () => {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-woo-price",
        title: t("Style")
      },
      position: 90,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodePrice",
              label: t("Price Style"),
              position: 40,
              options: [
                {
                  id: "priceStyle",
                  label: t("Style"),
                  type: "radioGroup-dev",
                  choices: [
                    { value: "style-1", icon: "t2-shopify-price-style1" },
                    { value: "style-2", icon: "t2-shopify-price-style2" },
                    { value: "style-3", icon: "t2-shopify-price-style3" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
