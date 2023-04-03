import React, { ReactElement } from "react";
import { Props } from "./types";

export const Quantity1 = ({
  step = 1,
  value = 1,
  min = 1,
  max,
  className,
  onChange
}: Props): ReactElement => {
  return (
    <div className="brz-shopify-quantity-style1">
      <input
        className={className}
        type="number"
        max={max}
        min={min}
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
