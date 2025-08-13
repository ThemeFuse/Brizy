import { mPipe } from "fp-utilities";
import React, { useCallback } from "react";
import { NumberComponent as Control } from "visual/component/Controls/Number";
import { OnChange } from "visual/component/Options/Type";
import { useDebouncedOnChange } from "visual/component/hooks";
import { add, clamp, subtractR } from "visual/utils/math";
import { MValue } from "visual/utils/value";
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
    (value) => onChange({ value }),
    [onChange]
  );
  const validateChange = useCallback(
    (v: number) => clamp(v, min, max),
    [min, max]
  );

  const t = useCallback(
    (x0: MValue<number>) => mPipe(validateChange, wrapValue)(x0),
    [validateChange, wrapValue]
  );
  const [_value, handleOnChange] = useDebouncedOnChange<number | undefined>(
    value,
    t,
    updateRate
  );
  const handleOnIncrease = useCallback(
    () => mPipe(() => _value, add(step), validateChange, handleOnChange)(),
    [_value, step, handleOnChange, validateChange]
  );
  const handleOnDecrease = useCallback(
    () =>
      mPipe(() => _value, subtractR(step), validateChange, handleOnChange)(),
    [_value, step, validateChange, handleOnChange]
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
        max={max}
        min={min}
      />
    </>
  );
};
