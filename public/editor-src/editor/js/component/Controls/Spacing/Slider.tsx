import React, { ReactElement, useCallback, useMemo } from "react";
import {
  NumberSlider,
  Props as NP
} from "visual/component/Controls/NumberSlider";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { OptionLabel } from "visual/component/OptionLabel";

export type Props<U> = {
  value: number;
  unit: U;
  onValue: OnChange<number>;
  onUnit: OnChange<U>;
  label?: string;
  icon?: string;
  units: NP<U>["units"];
  min: number;
  max: number;
  step: number;
};

export function Slider<U>({
  value,
  unit,
  onUnit,
  onValue,
  label,
  icon,
  units,
  min,
  max,
  step
}: Props<U>): ReactElement {
  const _value = useMemo(() => ({ number: value, unit }), [value, unit]);

  const onChange = useCallback<NP<U>["onChange"]>(
    v => {
      if (v.number !== value) {
        onValue(v.number);
      }

      if (v.unit !== unit) {
        onUnit(v.unit);
      }
    },
    [value, unit, onValue, onUnit]
  );

  return (
    <OptionWrapper className={"brz-ed-option"} display={"inline"}>
      <OptionLabel label={label} icon={icon} />
      <NumberSlider<U>
        value={_value}
        onChange={onChange}
        step={step}
        min={min}
        max={max}
        units={units}
      />
    </OptionWrapper>
  );
}
