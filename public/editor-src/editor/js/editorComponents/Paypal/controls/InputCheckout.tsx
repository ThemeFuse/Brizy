import React from "react";
import type { FCC } from "visual/utils/react/types";
import type { Literal } from "visual/utils/types/Literal";

export interface Props {
  price: string;
  shippingPrice: string;
  tax: Literal;
  quantity: string;
}

export const InputCheckout: FCC<Props> = ({
  price,
  shippingPrice,
  tax,
  quantity
}) => (
  <>
    <input type="hidden" name="amount" value={price} />
    <input type="hidden" name="shipping" value={shippingPrice} />
    <input type="hidden" name="tax_rate" value={tax} />
    <input type="hidden" name="quantity" value={quantity} />
  </>
);
