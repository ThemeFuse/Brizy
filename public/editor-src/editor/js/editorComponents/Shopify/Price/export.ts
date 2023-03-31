import { distinctUntilChanged, map } from "rxjs/operators";
import { getStore } from "visual/libs/shopify/Stores/AddToCart";
import {
  CartApiMock,
  ProductApiMock
} from "visual/libs/shopify/Stores/types/Api.mock";
import { ProductHandle } from "visual/libs/shopify/types/Product";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  const cartClient = new CartApiMock();
  const productClient = new ProductApiMock();

  node.querySelectorAll(`.brz-shopify-price`).forEach((item) => {
    const t = item.getAttribute("data-product-handle") as ProductHandle | null;
    const price = item.querySelector(".price");

    if (!t || !price) {
      return;
    }

    productClient.get(t).then((p) => {
      const store = getStore(p, cartClient);

      store.observable
        .pipe(
          map((i) => String(i.variationId)),
          distinctUntilChanged()
        )
        .subscribe((v) => (price.innerHTML = v));
    });
  });
}
