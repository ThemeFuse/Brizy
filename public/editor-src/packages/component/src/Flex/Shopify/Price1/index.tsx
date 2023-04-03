import React, { ReactElement } from "react";
import { Props } from "./types";

export const Price1 = ({
  newPrice,
  currency,
  oldPrice
}: Props): ReactElement => {
  return (
    <div className="brz-shopify-price-style1">
      <div className="brz-shopify-new-price">{`${newPrice} ${currency}`}</div>
      <div className="brz-shopify-old-price">
        <s>{`${oldPrice} ${currency}`}</s>
      </div>
    </div>
  );
};
