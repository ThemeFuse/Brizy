import { Button } from "component/Flex/Button";
import React, { ReactElement } from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { Props } from "./types";

export const Quantity2 = ({
  className,
  max,
  min = 1,
  onChange,
  onDecrease,
  onIncrease,
  step = 1,
  value = 1,
  attr
}: Props): ReactElement => {
  return (
    <div className="brz-shopify-quantity-style2">
      <Button className="brz-button-decrement" onClick={onDecrease}>
        <ThemeIcon name="simple-delete" type="outline" />
      </Button>
      <input
        className={className}
        max={max}
        min={min}
        step={step}
        defaultValue={value}
        {...attr}
        type="number"
        onChange={onChange}
      />
      <Button className="brz-button-increment" onClick={onIncrease}>
        <ThemeIcon name="simple-add" type="outline" />
      </Button>
    </div>
  );
};
