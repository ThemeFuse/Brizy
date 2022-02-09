import { Product, ProductHandle } from "../types/Product";
import { pass } from "fp-utilities";

export const get = (handle: ProductHandle): Promise<Product> => {
  return fetch(`/products/${handle}.js`)
    .then(pass(r => r.ok))
    .then(r => r.json());
};
