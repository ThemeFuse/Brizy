import { mPipe } from "fp-utilities";
import { getStore } from "visual/libs/shopify/Stores/AddToCart";
import {
  CartApiMock,
  ProductApiMock
} from "visual/libs/shopify/Stores/types/Api.mock";
import { ProductHandle } from "visual/libs/shopify/types/Product";
import * as Num from "visual/utils/math/number";
import { prop } from "visual/utils/object/get";
import { distinctUntilChanged, map, filter } from "rxjs/operators";
import { readKey } from "visual/utils/reader/object";
import { Ready } from "visual/libs/shopify/Stores/AddToCart/types/State";
import { VariationId } from "visual/libs/shopify/types/Variation";

export default function($node: JQuery): void {
  const node = $node.get(0);
  const cartClient = new CartApiMock();
  const productClient = new ProductApiMock();

  node.querySelectorAll(`.brz-shopify-variations`).forEach(item => {
    const t = item.getAttribute("data-product-handle") as ProductHandle | null;

    if (!t) {
      return;
    }

    const inputs = item.querySelectorAll<HTMLInputElement>(
      `input[data-product-handle="${t}"]`
    );

    productClient.get(t).then(p => {
      const store = getStore(p, cartClient);

      store.observable
        .pipe(
          filter((s): s is Ready => s.type === "Ready"),
          map(v => v.variationId),
          distinctUntilChanged(),
          map(String)
        )
        .subscribe(v => {
          inputs.forEach(input => (input.checked = input.value === v));
        });

      inputs.forEach(input => {
        input?.addEventListener(
          "change",
          mPipe(
            prop("target"),
            readKey("value"),
            Num.read,
            v => v as VariationId,
            store.setVariation
          )
        );
      });
    });
  });
}
