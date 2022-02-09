import { ProductHandle } from "../../../types/Product";
import { VariationId } from "visual/libs/shopify/types/Variation";

// region Fetching
export interface Fetching {
  type: "Fetching";
  handle: ProductHandle;
  quantity: number;
}

export const fetching = (
  handle: ProductHandle,
  quantity: number
): Fetching => ({
  type: "Fetching",
  quantity,
  handle
});
// endregion

// region Submitting
export interface Submitting {
  type: "Submitting";
  handle: ProductHandle;
  quantity: number;
  variationId: VariationId;
}

export const submitting = (
  handle: ProductHandle,
  quantity: number,
  variationId: VariationId
): Submitting => ({
  type: "Submitting",
  handle,
  quantity,
  variationId
});
// endregion

// region Ready
export interface Ready {
  type: "Ready";
  handle: ProductHandle;
  quantity: number;
  variationId: VariationId;
}

export const ready = (
  handle: ProductHandle,
  quantity: number,
  variationId: VariationId
): Ready => ({
  type: "Ready",
  handle,
  quantity,
  variationId
});
// endregion

export type State = Ready | Submitting;
