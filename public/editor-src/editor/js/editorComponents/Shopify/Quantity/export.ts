import { getStore } from "visual/libs/shopify/Stores/AddToCart";
import {
  CartApiMock,
  ProductApiMock
} from "visual/libs/shopify/Stores/types/Api.mock";
import { ProductHandle } from "visual/libs/shopify/types/Product";
import { read } from "visual/utils/math/number";
import { mPipe } from "fp-utilities";
import { prop } from "visual/utils/object/get";
import { distinctUntilChanged, map } from "rxjs/operators";
import { readKey } from "visual/utils/reader/object";

export default function($node: JQuery): void {
  const node = $node.get(0);
  const cartClient = new CartApiMock();
  const productClient = new ProductApiMock();

  node.querySelectorAll(`.brz-shopify-quantity`).forEach(item => {
    const t = item.getAttribute("data-product-handle") as ProductHandle | "";
    const input = item.querySelector(
      "input[type=number]"
    ) as HTMLInputElement | null;

    if (!t || !input) {
      return;
    }

    productClient.get(t).then(p => {
      const store = getStore(p, cartClient);

      store.observable
        .pipe(map(prop("quantity")), distinctUntilChanged(), map(String))
        .subscribe(v => (input.value = v));

      item.addEventListener(
        "change",
        mPipe(prop("target"), readKey("value"), read, store.setQuantity)
      );
    });
  });
}
