import { distinctUntilChanged } from "rxjs/operators";
import { add as addToCart } from "visual/libs/shopify/AjaxApi/Cart";
import { getStore } from "visual/libs/shopify/Stores/AddToCart";
import {
  CartApiMock,
  ProductApiMock
} from "visual/libs/shopify/Stores/types/Api.mock";
import { ProductHandle } from "visual/libs/shopify/types/Product";
import { getAddToCartData } from "./utils";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  const cartClient = new CartApiMock();
  const productClient = new ProductApiMock();

  node
    .querySelectorAll<HTMLDivElement>(".brz-shopify-add-to-cart")
    .forEach((item) => {
      const productId = item.getAttribute("data-product-handle") as
        | ProductHandle
        | "";
      const defaultVarintId = item.getAttribute("data-default-variant-id");

      if (!productId) {
        return;
      }

      const children = Array.from(item.children);

      productClient.get(productId).then((p) => {
        const store = getStore(p, cartClient);

        store.observable
          .pipe(
            distinctUntilChanged(
              (a, b) => a.type === b.type && a.quantity === b.quantity
            )
          )
          .subscribe((s): Element => {
            switch (s.type) {
              case "Submitting": {
                item.innerHTML = "Loading...";

                return item;
              }
              case "Ready": {
                item.innerHTML = "";
                item.append(...children);

                return item;
              }
            }
          });

        item.addEventListener("click", () => {
          addToCart(getAddToCartData({ productId, defaultVarintId }));
        });
      });
    });
}
