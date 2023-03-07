import { distinctUntilChanged } from "rxjs/operators";
import { getStore } from "visual/libs/shopify/Stores/AddToCart";
import {
  CartApiMock,
  ProductApiMock
} from "visual/libs/shopify/Stores/types/Api.mock";
import { ProductHandle } from "visual/libs/shopify/types/Product";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  const cartClient = new CartApiMock();
  const productClient = new ProductApiMock();

  node.querySelectorAll(`.brz-shopify-add-to-cart`).forEach((item) => {
    const t = item.getAttribute("data-product-handle") as ProductHandle | "";
    const children = Array.from(item.children);

    if (!t) {
      return;
    }

    productClient.get(t).then((p) => {
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
        store.submit();
      });
    });
  });
}
