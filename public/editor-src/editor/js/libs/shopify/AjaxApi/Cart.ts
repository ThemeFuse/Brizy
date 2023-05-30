import { pass } from "fp-utilities";
import { throwOnNullish } from "visual/utils/value";
import { VariationId } from "../types/Variation";

export interface Item {
  quantity: number;
  id: VariationId;
}

export const add = (body: FormData): Promise<Item[]> => {
  return fetch("/cart/add.js", {
    method: "POST",
    body
  })
    .then(pass((r) => r.ok))
    .then(throwOnNullish("Unable to fetch product data"))
    .then((r) => r.json());
};
