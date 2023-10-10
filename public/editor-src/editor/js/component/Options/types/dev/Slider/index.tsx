import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { Unit } from "visual/component/Controls/NumberUnit/types";
import * as Option from "visual/component/Options/Type";
import { useThrottleEffect } from "visual/component/hooks";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Value, eq } from "./types/Value";

export type Config = {
  min?: number;
  max?: number;
  step?: number;
  debounceUpdate?: boolean;
  updateRate?: number;
  inputMin?: number;
  inputMax?: number;
  units?: Unit<string>[];
};

export type Props = Option.Props<Value> & WithConfig<Config> & WithClassName;

export const Slider: FC<Props> = ({
  className,
  onChange,
  value,
  config = {},
  label
}) => {
  const {
    debounceUpdate,
    updateRate = 16,
    min = 0,
    max = 100,
    inputMin,
    inputMax,
    step = 1,
    units = []
  } = config ?? {};

  const onEdit = debounceUpdate ?? false;
  const ref = useRef<Value>();
  const [_value, setValue] = useState<Value>(value);
  const [editing, setEdit] = useState<boolean>(false);
  const _onChange = useCallback(
    (
      v: Omit<Value, "value"> & { number: number },
      m: { editing: boolean }
    ): void => {
      setValue({ value: v.number, unit: v.unit });
      setEdit(m.editing);
    },
    [setValue, setEdit]
  );

  useThrottleEffect(
    () => {
      if (!eq(value, _value) && (!onEdit || !editing)) {
        onChange(_value);
        ref.current = _value;
      }
    },
    Math.max(0, updateRate),
    [_value, onEdit, editing, updateRate]
  );

  useEffect(() => {
    if (!ref.current || !eq(value, ref.current)) {
      setValue(value);
    }
  }, [value]);

  return (
    <>
      {label}
      <NumberSlider
        className={className}
        min={min}
        max={max}
        inputMin={inputMin}
        inputMax={inputMax}
        step={step}
        value={{ number: _value.value, unit: _value.unit }}
        onChange={_onChange}
        units={units}
      />
    </>
  );
};
