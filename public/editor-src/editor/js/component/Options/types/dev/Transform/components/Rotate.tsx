import { mPipe } from "fp-utilities";
import React, { JSXElementConstructor, useCallback } from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { Unit } from "visual/component/Controls/NumberUnit/types";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { useThrottleOnChange } from "visual/component/hooks";
import { t } from "visual/utils/i18n";
import { EffectProps } from "../types/EffectProps";
import { Rotate as V } from "../types/Rotate";
import * as Degree from "../types/utils/Degree";

const units: Unit<"°">[] = [
  {
    value: "°",
    title: "°"
  }
];

export const Rotate: JSXElementConstructor<EffectProps<V>> = ({
  value,
  onChange
}) => {
  const onDegreeChange = useCallback<OnChange<number>>(
    mPipe(Degree.fromNumber, (degree) => onChange({ ...value, degree })),
    [value, onChange]
  );

  const [degree, handleDegreeChange] = useThrottleOnChange<number>(
    value.degree,
    onDegreeChange,
    200
  );

  return (
    <OptionWrapper className={"brz-ed-option"}>
      <OptionLabel label={t("Rotation")} />
      <NumberSlider<"°">
        value={{ number: degree, unit: "°" }}
        onChange={({ number }) => handleDegreeChange(number)}
        step={1}
        min={-359}
        max={359}
        units={units}
      />
    </OptionWrapper>
  );
};
