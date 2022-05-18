import React, { ReactElement, useCallback } from "react";
import * as Unit from "visual/utils/math/Unit";
import { OnChange } from "visual/component/Options/Type";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { mPipe } from "visual/utils/fp";
import {
  NumberSlider,
  Props as NSProps
} from "visual/component/Controls/NumberSlider";
import { useThrottleOnChange } from "visual/component/hooks";

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
    mPipe((v: V) => v.number / 10, Unit.fromNumber, _onChange),
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
