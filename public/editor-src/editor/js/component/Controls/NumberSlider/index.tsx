import React, { ReactElement, useCallback } from "react";
import classNames from "classnames";
import {
  WithClassName,
  WithOnChange2,
  WithValue
} from "visual/utils/options/attributes";
import { Slider2 } from "visual/component/Controls/Slider2";
import { NumberUnit } from "visual/component/Controls/NumberUnit";
import { Unit, Value } from "visual/component/Controls/NumberUnit/types";

type Meta = { editing: boolean };

export type Props<U> = WithClassName &
  WithValue<Value<U>> &
  WithOnChange2<Value<U>, Meta> & {
    step: number;
    min: number;
    max: number;
    inputMin?: number;
    inputMax?: number;
    units: Unit<U>[];
  };

export function NumberSlider<U>({
  value: { number, unit },
  onChange,
  className,
  min,
  max,
  inputMin,
  inputMax,
  step,
  units
}: Props<U>): ReactElement {
  const _sliderChange = useCallback(
    (number: number, m: Meta): void => onChange({ number, unit }, m),
    [onChange, unit]
  );
  const _numberChange = useCallback(
    (v: Value<U>): void => onChange(v, { editing: false }),
    [onChange]
  );
  return (
    <div className={classNames("brz-ed__control--number-slider", className)}>
      <Slider2
        value={number}
        onChange={_sliderChange}
        step={step}
        min={min}
        max={max}
      />
      <NumberUnit<U>
        units={units}
        step={step}
        min={inputMin ? Math.min(min, inputMin) : undefined}
        max={inputMax ? Math.max(max, inputMax) : undefined}
        value={{ number, unit }}
        onChange={_numberChange}
      />
    </div>
  );
}
