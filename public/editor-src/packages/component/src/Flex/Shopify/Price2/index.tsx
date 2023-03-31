import React, { ReactElement } from "react";
import { Props } from "./types";

export const Price2 = ({ price, currency }: Props): ReactElement => {
  return (
    <div className="brz-shopify-price-style2">
      <div className="brz-shopify-price">{`${price} ${currency}`}</div>
    </div>
  );
};
