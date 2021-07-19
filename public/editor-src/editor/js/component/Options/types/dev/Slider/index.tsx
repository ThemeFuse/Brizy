import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import * as Option from "visual/component/Options/Type";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { NumberSpec } from "visual/utils/math/number";
import { throttleEffect } from "visual/component/hooks";
import { String } from "visual/utils/string/specs";
import { Unit } from "visual/component/Controls/NumberUnit/types";
import { Value, eq } from "./types/Value";
import { fromValue } from "visual/component/Options/types/dev/Slider/utils";

export type Config = {
  min?: number;
  max?: number;
  step?: number;
  debounceUpdate?: boolean;
  updateRate: number;
  inputMin?: number;
  inputMax?: number;
  units?: Unit<string>[];
};

export type Props = Option.Props<Value> & WithConfig<Config> & WithClassName;

export const Slider: FC<Props> & Option.OptionType<Value> = ({
  className,
  onChange,
  value,
  config = {},
  label
}) => {
  const onEdit = config.debounceUpdate ?? false;
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

  throttleEffect(
    () => {
      if (!eq(value, _value) && (!onEdit || !editing)) {
        onChange(fromValue(_value));
        ref.current = _value;
      }
    },
    Math.max(0, config?.updateRate ?? 16),
    [_value.value, _value.unit, onEdit, editing]
  );

  useEffect(() => {
    if (!ref.current || !eq(value, ref.current)) {
      setValue(value);
    }
  }, [value.value, value.unit]);

  return (
    <>
      {label}
      <NumberSlider
        className={className}
        min={config.min ?? 0}
        max={config.max ?? 100}
        inputMin={config?.inputMin}
        inputMax={config?.inputMax}
        step={config.step ?? 1}
        value={{ number: _value.value, unit: _value.unit }}
        onChange={_onChange}
        units={config.units ?? []}
      />
    </>
  );
};

const getModel: Option.GetModel<Value> = get => {
  return {
    value: NumberSpec.read(get("value")),
    unit: String.read(get("suffix"))
  };
};

const getElementModel: Option.GetElementModel<Value> = (values, get) => {
  return {
    [get("value")]: values.value,
    [get("suffix")]: values.unit
  };
};

Slider.getModel = getModel;

Slider.getElementModel = getElementModel;

Slider.defaultValue = {
  value: 0,
  unit: ""
};
