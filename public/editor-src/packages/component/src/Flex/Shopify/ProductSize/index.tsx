import React, { ReactElement } from "react";
import { Size } from "./Size";
import { Props } from "./types";

export const ProductSize = ({
  selected,
  sizeValue,
  onChange
}: Props<string>): ReactElement => {
  return (
    <div className="brz-product__variant-size">
      <div className="brz-shopify-product__size-header">
        <legend> Size </legend>
        <a>Size guide</a>
      </div>
      <div className="brz-shopify-product__grid-container">
        {sizeValue?.map((el, index) => (
          <Size
            value={el.value}
            disabled={!selected}
            isActive={el.value === selected}
            key={index}
            onClick={() => {
              onChange?.(el.value);
            }}
          />
        ))}
      </div>
    </div>
  );
};
