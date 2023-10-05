import { add as addToCart } from "visual/libs/shopify/AjaxApi/Cart";
import { ProductHandle } from "visual/libs/shopify/types/Product";
import { getAddToCartData, useSpinner } from "./utils";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  if (!node) return;

  node
    .querySelectorAll<HTMLButtonElement>(".brz-shopify-add-to-cart")
    .forEach((item) => {
      const productId = item.getAttribute("data-product-handle") as
        | ProductHandle
        | "";
      const defaultVarintId = item.getAttribute("data-default-variant-id");

      if (!productId) {
        return;
      }

      item.addEventListener("click", async () => {
        useSpinner({ cartNode: item, loading: true });

        await addToCart(getAddToCartData({ productId, defaultVarintId }));

        useSpinner({ cartNode: item, loading: false });
      });
    });
}
