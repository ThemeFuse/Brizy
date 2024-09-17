import classNames from "classnames";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { useThrottleEffect } from "visual/component/hooks";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { Config } from "./types/Config";
import { eq, Value } from "./types/Value";
import { sliderClassName } from "./utils";

export type Props = Option.Props<Value> & WithConfig<Config> & WithClassName;

export const Slider = ({
  className,
  onChange,
  value,
  config = {},
  label
}: Props): ReactElement => {
  const {
    debounceUpdate,
    updateRate = 16,
    min = 0,
    max = 100,
    inputMin,
    inputMax,
    step = 1,
    units = [],
    size
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

  const cls = classNames(sliderClassName(label, size), className);

  return (
    <>
      {label}
      <NumberSlider
        className={cls}
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
