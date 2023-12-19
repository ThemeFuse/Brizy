import classNames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import {
  Props as NP,
  NumberSlider
} from "visual/component/Controls/NumberSlider";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";

export type Props<U> = {
  className?: string;
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
  title?: string;
};

export function Slider<U extends Literal>({
  value,
  unit,
  onUnit,
  onValue,
  label,
  icon,
  units,
  min,
  max,
  step,
  className,
  title
}: Props<U>): ReactElement {
  const _value = useMemo(() => ({ number: value, unit }), [value, unit]);

  const onChange = useCallback<NP<U>["onChange"]>(
    (v) => {
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
    <OptionWrapper
      className={classNames("brz-ed-option", className)}
      display={"inline"}
      title={title}
    >
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
