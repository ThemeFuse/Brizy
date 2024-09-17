import React, { useCallback, useMemo } from "react";
import {
  NumberSlider,
  Props as NSProps
} from "visual/component/Controls/NumberSlider";
import { Value } from "visual/component/Controls/NumberUnit/types";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { mPipe } from "visual/utils/fp";
import * as Unit from "visual/utils/math/Unit";
import { FCC } from "visual/utils/react/types";
import { OnChange } from "../types";

export interface Props {
  label: string;
  value: Unit.Unit;
  onChange: OnChange<Unit.Unit>;
}

const params = {
  step: 0.1,
  min: 0,
  max: 2,
  units: []
};

export const UnitSlider: FCC<Props> = ({ label, value, onChange }) => {
  const _onChange = useCallback<
    OnChange<NSProps<"">["value"], { editing?: boolean }>
  >(
    (v) =>
      mPipe(
        (v: NSProps<"">["value"]) => v.number / 10,
        Unit.fromNumber,
        onChange
      )(v),
    [onChange]
  );

  const valueUnitSlider = useMemo(
    (): Value<""> => ({ number: value * 10, unit: "" }),
    [value]
  );

  return (
    <OptionWrapper className="brz-ed-option">
      <OptionLabel label={label} />
      <NumberSlider<"">
        {...params}
        value={valueUnitSlider}
        onChange={_onChange}
      />
    </OptionWrapper>
  );
};
