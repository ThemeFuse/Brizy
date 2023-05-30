import React, { ReactElement } from "react";
import { Props } from "./types";

export const Quantity1 = ({
  step = 1,
  value = 1,
  min = 1,
  max,
  className,
  onChange,
  attr
}: Props): ReactElement => {
  return (
    <div className="brz-shopify-quantity-style1">
      <input
        className={className}
        type="number"
        max={max}
        min={min}
        step={step}
        {...attr}
        defaultValue={value}
        onChange={onChange}
      />
    </div>
  );
};
