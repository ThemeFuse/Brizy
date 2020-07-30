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
  units?: Unit[];
};

export type Props = Option.Props<Value, { value: number; suffix: string }> &
  WithConfig<Config> &
  WithClassName;

export const Slider: FC<Props> & Option.OptionType<Value> = ({
  className,
  onChange,
  value,
  config = {}
}) => {
  const onEdit = config.debounceUpdate ?? false;
  const ref = useRef<Value>();
  const [_value, setValue] = useState<Value>(value);
  const [editing, setEdit] = useState<boolean>(false);
  const _onChange = useCallback(
    (v: Value, m: { editing: boolean }): void => {
      setValue(v);
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
    [_value.number, _value.unit, onEdit, editing]
  );

  useEffect(() => {
    if (!ref.current || !eq(value, ref.current)) {
      setValue(value);
    }
  }, [value.number, value.unit]);

  return (
    <NumberSlider
      className={className}
      min={config.min ?? 0}
      max={config.max ?? 100}
      inputMin={config?.inputMin}
      inputMax={config?.inputMax}
      step={config.step ?? 1}
      value={_value}
      onChange={_onChange}
      units={config.units ?? []}
    />
  );
};

const getModel: Option.GetModel<Value> = (get): Value => ({
  number: NumberSpec.read(get("value")) ?? 0,
  unit: String.read(get("suffix")) ?? ""
});

Slider.getModel = getModel;
