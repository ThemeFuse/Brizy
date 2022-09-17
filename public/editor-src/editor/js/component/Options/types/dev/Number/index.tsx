import { mPipe } from "fp-utilities";
import React, { useCallback } from "react";
import { NumberComponent as Control } from "visual/component/Controls/Number";
import { useDebouncedOnChange } from "visual/component/hooks";
import * as Option from "visual/component/Options/Type";
import { OnChange, SimpleValue } from "visual/component/Options/Type";
import { pipe } from "visual/utils/fp";
import { add, clamp, subtractR } from "visual/utils/math";
import { NumberSpec } from "visual/utils/math/number";
import { wrap } from "visual/utils/object/get";
import { Component } from "./Type";

export const Number: Component = ({
  className,
  onChange,
  value: { value },
  config,
  label
}) => {
  const updateRate = config?.updateRate ?? 16;
  const min = config?.min ?? 0;
  const max = config?.max ?? 100;
  const step = config?.step ?? 1;
  const size = config?.size ?? "short";
  const spinner = config?.spinner ?? true;
  const wrapValue: OnChange<number> = useCallback(
    pipe(wrap("value"), onChange),
    [onChange]
  );
  const validateChange = useCallback(
    (v: number) => clamp(v, min, max),
    [min, max]
  );

  const t = useCallback(mPipe(validateChange, wrapValue), [
    validateChange,
    wrapValue
  ]);
  const [_value, handleOnChange] = useDebouncedOnChange<number | undefined>(
    value,
    t,
    updateRate
  );
  const handleOnIncrease = useCallback(
    mPipe(() => _value, add(step), validateChange, handleOnChange),
    [_value, step]
  );
  const handleOnDecrease = useCallback(
    mPipe(() => _value, subtractR(step), validateChange, handleOnChange),
    [_value, step]
  );

  return (
    <>
      {label}
      <Control
        className={className}
        onChange={handleOnChange}
        onIncrease={handleOnIncrease}
        onDecrease={handleOnDecrease}
        value={_value}
        size={size}
        spinner={spinner}
      />
    </>
  );
};

const getModel: Option.FromElementModel<SimpleValue<number>> = (get) => ({
  value: NumberSpec.read(get("value"))
});

const getElementModel: Option.ToElementModel<SimpleValue<number>> = (
  values
) => {
  return {
    value: values.value
  };
};

Number.fromElementModel = getModel;

Number.toElementModel = getElementModel;

Number.defaultValue = { value: 0 };
