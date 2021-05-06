import React, { useEffect, useRef, useState } from "react";
import { Number as Control } from "visual/component/Controls/Number";
import * as Option from "visual/component/Options/Type";
import { throttleEffect } from "visual/component/hooks";
import { SimpleValue } from "visual/component/Options/Type";
import { Component } from "./Type";
import { NumberSpec } from "visual/utils/math/number";
import { clamp } from "visual/utils/math";

export const Number: Component = ({
  className,
  onChange,
  value: { value },
  config,
  label
}) => {
  const [_value, setValue] = useState(value);
  const ref = useRef<number>();
  const updateRate = config?.updateRate ?? 16;
  const min = config?.min ?? 0;
  const max = config?.max ?? 100;
  const step = config?.step ?? 1;
  const size = config?.size ?? "short";
  const spinner = config?.spinner ?? true;

  throttleEffect(
    () => {
      if (value !== _value) {
        onChange({ value: clamp(_value, min, max) });
      }
    },
    Math.max(0, updateRate),
    [_value, updateRate]
  );

  useEffect(() => {
    if (value !== ref.current) {
      setValue(value);
    }
  }, [value]);

  return (
    <>
      {label}
      <Control
        className={className}
        onChange={setValue}
        value={_value}
        size={size}
        min={min}
        max={max}
        step={step}
        spinner={spinner}
      />
    </>
  );
};

const getModel: Option.GetModel<SimpleValue<number>> = get => ({
  value: NumberSpec.read(get("value"))
});

const getElementModel: Option.GetElementModel<SimpleValue<number>> = (
  values,
  get
) => {
  return {
    [get("value")]: values.value
  };
};

Number.getModel = getModel;

Number.getElementModel = getElementModel;

Number.defaultValue = { value: 0 };
