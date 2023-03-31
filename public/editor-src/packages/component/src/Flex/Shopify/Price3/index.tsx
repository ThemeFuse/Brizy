import React, { ReactElement } from "react";
import { Props } from "./types";

export const Price3 = ({ price, currency }: Props): ReactElement => {
  return (
    <div className="brz-shopify-price-style3">
      <div className="brz-shopify-price">
        <s>{`${price} ${currency}`}</s>
      </div>
    </div>
  );
};
