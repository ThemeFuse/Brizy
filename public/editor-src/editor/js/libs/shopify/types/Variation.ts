import { Price } from "./Price";
import { ProductId } from "visual/libs/shopify/types/Product";
import { StringDate } from "visual/utils/date/StringDate";
import { PreviewImage } from "visual/libs/shopify/types/PreviewImage";

declare const _variationId: unique symbol;
export type VariationId = number & { [_variationId]: "VariationId" };

declare const _sku: unique symbol;
export type SKU = string & { [_sku]: "SKU" };

export interface Variation {
  id: VariationId;
  title: string;
  options: string[];
  option1: string | null;
  option2: string | null;
  option3: string | null;
  price: Price;
  weight: number;
  compare_at_price: Price | null;
  inventory_management: "shopify";
  available: boolean;
  sku: SKU | null;
  requires_shipping: boolean;
  taxable: boolean;
  barcode: string;
  featured_image?: {
    id: number;
    product_id: ProductId;
    position: number;
    created_at: StringDate;
    updated_at: StringDate;
    alt: null | string;
    width: number;
    height: number;
    src: string;
    variant_ids: VariationId[];
  };
  featured_media?: {
    alt: null | string;
    id: number;
    position: number;
    preview_image: PreviewImage;
  };
}
