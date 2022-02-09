import { StringDate } from "visual/utils/date/StringDate";
import { Variation } from "./Variation";
import { PreviewImage } from "visual/libs/shopify/types/PreviewImage";
import { NonEmptyArray } from "visual/utils/array/types";

declare const _id: unique symbol;
export type ProductId = number & { [_id]: "ProductId" };

declare const _handle: unique symbol;
export type ProductHandle = string & { [_handle]: "ProductHandle" };

export interface Media {
  alt: null | string;
  id: number;
  position: number;
  preview_image: PreviewImage;
  aspect_ratio: number;
  height: number;
  media_type: "image";
  src: string;
  width: number;
}

export interface Product {
  id: ProductId;
  title: string;
  handle: ProductHandle;
  description: string;
  published_at: StringDate;
  created_at: StringDate;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;
  compare_at_price: number | null;
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: boolean;
  variants: NonEmptyArray<Variation>;
  images: string[];
  featured_image: string;
  options: Array<{
    name: string;
    position: number;
    values: string[];
  }>;
  url: string;
  media?: Media[];
}
