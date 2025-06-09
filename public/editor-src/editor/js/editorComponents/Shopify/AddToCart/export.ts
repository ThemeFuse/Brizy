import { add as addToCart } from "visual/libs/shopify/AjaxApi/Cart";
import { ProductHandle } from "visual/libs/shopify/types/Product";
import { makeAttr } from "visual/utils/i18n/attribute";
import { getAddToCartData, handleSpinner } from "./utils";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  if (!node) return;

  node
    .querySelectorAll<HTMLButtonElement>(".brz-shopify-add-to-cart")
    .forEach((item) => {
      const productId = item.getAttribute(makeAttr("product-handle")) as
        | ProductHandle
        | "";
      const defaultVarintId = item.getAttribute(makeAttr("default-variant-id"));

      if (!productId) {
        return;
      }

      item.addEventListener("click", async () => {
        handleSpinner({
          cartNode: item,
          loading: true,
          className: "brz-shopify-add-to-cart--spinner"
        });

        await addToCart(getAddToCartData({ productId, defaultVarintId }));

        handleSpinner({
          cartNode: item,
          loading: false,
          className: "brz-shopify-add-to-cart--spinner"
        });
      });
    });
}
