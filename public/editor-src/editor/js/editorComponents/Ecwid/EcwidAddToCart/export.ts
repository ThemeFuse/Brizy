import { isFunction } from "es-toolkit";
import type { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import type { ExportFunction } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";
import type { Literal } from "visual/utils/types/Literal";
import { handleSpinner } from "../../Shopify/AddToCart/utils";

declare const Ecwid: {
  Cart?: {
    addProduct?: (data: {
      id: Literal;
      callback: (success: boolean) => void;
    }) => void;
  };
};

export const fn: ExportFunction = ($node) => {
  const node = $node.get(0);

  if (!node) return;

  node
    .querySelectorAll<HTMLButtonElement>(".brz-ecwid-add-to-cart")
    .forEach((item) => {
      const isInitialized = typeof Ecwid !== "undefined";

      if (!isInitialized || !Ecwid.Cart || !isFunction(Ecwid.Cart.addProduct)) {
        const storeId = item.getAttribute(
          makeAttr("store-id")
        ) as EcwidStoreId | null;

        if (storeId) {
          EcwidService.init(storeId, {}).loadScripts();
        }
      }

      const productId = item.getAttribute(makeAttr("product-id"));

      if (productId) {
        item.addEventListener("click", () => {
          handleSpinner({
            cartNode: item,
            loading: true,
            className: "brz-ecwid-add-to-cart--spinner"
          });

          Ecwid?.Cart?.addProduct?.({
            id: productId,
            callback: () =>
              handleSpinner({
                cartNode: item,
                loading: false,
                className: "brz-ecwid-add-to-cart--spinner"
              })
          });
        });
      }
    });
};
