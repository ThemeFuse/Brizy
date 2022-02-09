import { pass } from "fp-utilities";
import { VariationId } from "../types/Variation";
import { throwOnNullish } from "visual/utils/value";

export interface Item {
  quantity: number;
  id: VariationId;
}

export const add = (items: Item[]): Promise<Item[]> => {
  return fetch("/cart/add.js", {
    method: "POST",
    body: JSON.stringify(items)
  })
    .then(pass(r => r.ok))
    .then(throwOnNullish("Unable to fetch product data"))
    .then(r => r.json());
};
