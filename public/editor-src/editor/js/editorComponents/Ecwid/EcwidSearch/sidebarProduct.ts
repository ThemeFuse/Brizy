import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { productCardSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = () => [
  {
    id: "sidebarTabs",
    type: "sidebarTabs",
    tabs: [
      {
        id: "styles",
        title: t("Styling"),
        label: t("Styling"),
        options: [
          {
            id: "productBorder",
            type: "corners",
            label: t("Corner"),
            selector: `${productCardSelector} .grid-product__wrap-inner, ${productCardSelector} .grid-product__bg, ${productCardSelector} .grid-product__picture`
          }
        ]
      }
    ]
  }
];
