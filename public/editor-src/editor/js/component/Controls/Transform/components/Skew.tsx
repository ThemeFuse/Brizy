import { mPipe } from "fp-utilities";
import React, { useCallback, useMemo } from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { Unit, Value } from "visual/component/Controls/NumberUnit/types";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";
import * as Degree from "../Degree";
import { OnChange } from "../types";
import { EffectProps } from "../types/EffectProps";
import { Skew as V } from "../types/Skew";

const units: Unit<"°">[] = [
  {
    value: "°",
    title: "°"
  }
];

export const Skew: FCC<EffectProps<V>> = ({ value, onChange }) => {
  const onSkewXChange = useCallback<OnChange<number>>(
    (v) =>
      mPipe(Degree.fromNumber, (skewX) => onChange({ ...value, skewX }))(v),
    [value, onChange]
  );

  const onSkewYChange = useCallback<OnChange<number>>(
    (v) =>
      mPipe(Degree.fromNumber, (skewY) => onChange({ ...value, skewY }))(v),
    [value, onChange]
  );

  const valueSkewX = useMemo(
    (): Value<"°"> => ({
      number: value.skewX,
      unit: "°"
    }),
    [value.skewX]
  );

  const valueSkewY = useMemo(
    (): Value<"°"> => ({
      number: value.skewY,
      unit: "°"
    }),
    [value.skewY]
  );

  const onChangeSkewX = useCallback(
    ({ number }: { number: number }) => onSkewXChange(number),
    [onSkewXChange]
  );

  const onChangeSkewY = useCallback(
    ({ number }: { number: number }) => onSkewYChange(number),
    [onSkewYChange]
  );

  return (
    <>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("SkewX")} />
        <NumberSlider<"°">
          value={valueSkewX}
          onChange={onChangeSkewX}
          step={1}
          min={-359}
          max={359}
          units={units}
        />
      </OptionWrapper>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("SkewY")} />
        <NumberSlider<"°">
          value={valueSkewY}
          onChange={onChangeSkewY}
          step={1}
          min={-359}
          max={359}
          units={units}
        />
      </OptionWrapper>
    </>
  );
};
