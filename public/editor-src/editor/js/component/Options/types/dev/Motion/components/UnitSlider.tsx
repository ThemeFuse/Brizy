import React, { ReactElement, useCallback } from "react";
import {
  Props as NSProps,
  NumberSlider
} from "visual/component/Controls/NumberSlider";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { useThrottleOnChange } from "visual/component/hooks";
import { mPipe } from "visual/utils/fp";
import * as Unit from "visual/utils/math/Unit";

export type Props = {
  label: string;
  value: Unit.Unit;
  onChange: OnChange<Unit.Unit>;
};

export const UnitSlider = ({ label, value, onChange }: Props): ReactElement => {
  type V = NSProps<"">["value"];

  const [_value, _onChange] = useThrottleOnChange<Unit.Unit>(
    value,
    onChange,
    500
  );
  const handleNumberChange = useCallback<OnChange<V>>(
    (v) => mPipe((v: V) => v.number / 10, Unit.fromNumber, _onChange)(v),
    [_onChange]
  );

  return (
    <OptionWrapper className={"brz-ed-option"}>
      <OptionLabel label={label} />
      <NumberSlider<"">
        value={{ number: _value * 10, unit: "" }}
        onChange={handleNumberChange}
        step={0.1}
        min={0}
        max={10}
        units={[]}
      />
    </OptionWrapper>
  );
};
