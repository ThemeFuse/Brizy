import { Item } from "../../AjaxApi/Cart";
import { Product, ProductHandle } from "../../types/Product";

export interface CartApi {
  add: (items: Item[]) => Promise<Item[]>;
}

export interface ProductApi {
  get: (handle: ProductHandle) => Promise<Product>;
}
