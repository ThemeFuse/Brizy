import { Button } from "component/Flex/Button";
import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Props } from "./types";

export const Quantity2 = ({
  className,
  max,
  min = 1,
  onChange,
  onDecrease,
  onIncrease,
  step = 1,
  value = 1
}: Props): ReactElement => {
  return (
    <div className="brz-shopify-quantity-style2">
      <Button className="brz-button" onClick={onDecrease}>
        <EditorIcon icon="nc-remove" />
      </Button>
      <input
        className={className}
        max={max}
        min={min}
        step={step}
        value={value}
        type="number"
        onChange={onChange}
      />
      <Button className="brz-button" onClick={onIncrease}>
        <EditorIcon icon="nc-warning" />
      </Button>
    </div>
  );
};
