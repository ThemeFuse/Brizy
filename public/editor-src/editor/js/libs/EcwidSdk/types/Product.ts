import { EcwidProductId } from "visual/global/Ecwid/types";

// region Sku
declare const _sku: unique symbol;

export type Sku = string & { [_sku]: "Sku" };
// endregion

// region Price
declare const _price: unique symbol;

export type Price = number & { [_price]: "Price" };
// endregion

export interface Product {
  /**
   * Unique integer product identifier
   */
  id: EcwidProductId;
  /**
   * Product SKU. Items with options can have several SKUs specified in the product variations
   */
  sku: Sku;
  /**
   * Amount of product items in stock. This field is omitted for the products with unlimited stock
   */
  quantity: number;
  /**
   * Variation price. Omitted if the variation inherits the base product's price.
   */
  price: Price;
  /**
   * Product title
   */
  name: string;
  /**
   * true if product is enabled, false otherwise. Disabled products are not displayed in the store front.
   */
  enabled: boolean;
}
