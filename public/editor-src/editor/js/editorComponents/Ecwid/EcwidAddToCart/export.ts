import { isFunction } from "es-toolkit";
import type { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import type { ExportFunction } from "visual/types";
import { getEcwidShopPathFromAttribute } from "visual/utils/ecwid";
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

const handleClick = (
  data: { item: HTMLElement; baseUrl: string },
  callback: VoidFunction
): void => {
  const { item, baseUrl } = data;

  const isInitialized = typeof Ecwid !== "undefined";

  if (!isInitialized || !Ecwid.Cart || !isFunction(Ecwid.Cart.addProduct)) {
    const storeId = item.getAttribute(
      makeAttr("store-id")
    ) as EcwidStoreId | null;
    const langLocale = item.getAttribute(makeAttr("lang-locale")) ?? "";

    if (storeId) {
      EcwidService.init(storeId, { baseUrl, langLocale }).loadScripts({
        callback
      });
    }
  } else {
    callback();
  }
};

export const fn: ExportFunction = ($node) => {
  const node = $node.get(0);

  if (!node) return;

  node
    .querySelectorAll<HTMLButtonElement>(".brz-ecwid-add-to-cart")
    .forEach((item) => {
      const productId = item.getAttribute(makeAttr("product-id"));

      if (productId) {
        const baseUrl = getEcwidShopPathFromAttribute(item) ?? "";

        const handleAddToCart = () => {
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
        };

        item.addEventListener("click", () => {
          handleClick({ item, baseUrl }, handleAddToCart);
        });
      }
    });
};
