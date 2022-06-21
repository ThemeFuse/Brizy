import React, { FC, useCallback } from "react";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import {
  Props as OptionProps,
  OptionType
} from "visual/component/Options/Type";
import { RangeSlider as Control } from "visual/component/Controls/RangeSlider";
import { useThrottleOnChange } from "visual/component/hooks";
import { Value, eq } from "./types/Value";
import * as Converters from "./converters";

export type Config = {
  min?: number;
  max?: number;
  step?: number;
  updateRate?: number;
  unit?: string;
  startLabel?: string;
  endLabel?: string;
};

export type Props = OptionProps<Value> & WithConfig<Config> & WithClassName;

export const Range: FC<Props> & OptionType<Value> = ({
  className,
  onChange,
  value,
  config = {},
  label
}) => {
  const [_value, _onChange] = useThrottleOnChange(
    value,
    onChange,
    config.updateRate ?? 10,
    eq
  );

  const handleStart = useCallback(
    (from: number) => _onChange({ from, to: _value.to }),
    [_onChange, _value.to]
  );
  const handleEnd = useCallback(
    (to: number) => _onChange({ to, from: _value.from }),
    [_onChange, _value.from]
  );

  return (
    <>
      {label}
      <Control
        className={className}
        min={config.min ?? 0}
        max={config.max ?? 100}
        step={config.step ?? 1}
        start={_value.from}
        end={_value.to}
        unit={config.unit}
        onChangeStart={handleStart}
        onChangeEnd={handleEnd}
        startLabel={config.startLabel}
        endLabel={config.endLabel}
      />
    </>
  );
};

Range.defaultValue = Converters.defaultValue;
Range.fromElementModel = Converters.fromElementModel;
Range.toElementModel = Converters.toElementModel;
