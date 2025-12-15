import classNames from "classnames";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import * as Option from "visual/component/Options/Type";
import { useThrottleEffect } from "visual/component/hooks";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { Config } from "./types/Config";
import { Value, eq } from "./types/Value";
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
  // Track if we just sent a change to ignore stale responses
  const pendingChangeRef = useRef(false);
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
        // Mark that we just sent a change - next incoming value might be stale
        pendingChangeRef.current = true;
      }
    },
    Math.max(0, updateRate),
    [_value, onEdit, editing, updateRate]
  );

  useEffect(() => {
    // If we just sent a change, ignore the first incoming value
    // (it's likely stale, arriving before our change was processed)
    if (pendingChangeRef.current) {
      pendingChangeRef.current = false;
      return;
    }

    // Normal sync for external value changes
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
