import React, { ReactElement } from "react";
import { Props } from "./types";

export const ProductSelect = ({ sizeValue }: Props): ReactElement => {
  return (
    <div className="brz-product__variant-default">
      <label htmlFor="shopify_product_select">Choose size: </label>
      <select name="shopify_product_select" id="shopify_product_select">
        {sizeValue?.map((el, index) => {
          return (
            <option key={index} value={el.value}>
              {el.value}
            </option>
          );
        })}
      </select>
    </div>
  );
};
