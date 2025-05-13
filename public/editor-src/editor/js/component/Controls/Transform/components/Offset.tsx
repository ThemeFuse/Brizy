import { mPipe } from "fp-utilities";
import React, { useCallback, useMemo } from "react";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { Unit, Value } from "visual/component/Controls/NumberUnit/types";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { t } from "visual/utils/i18n";
import * as Number from "visual/utils/math/number";
import { FCC } from "visual/utils/react/types";
import { OnChange } from "../types";
import { EffectProps } from "../types/EffectProps";
import { Offset as V } from "../types/Offset";

const units: Unit<"px">[] = [
  {
    value: "px",
    title: "px"
  }
];

export const Offset: FCC<EffectProps<V>> = ({ value, onChange }) => {
  const onOffsetYChange = useCallback<OnChange<number>>(
    (v) => mPipe(Number.read, (offsetY) => onChange({ ...value, offsetY }))(v),
    [value, onChange]
  );

  const onOffsetXChange = useCallback<OnChange<number>>(
    (v) => mPipe(Number.read, (offsetX) => onChange({ ...value, offsetX }))(v),
    [value, onChange]
  );

  const valueOffsetX = useMemo(
    (): Value<"px"> => ({
      number: value.offsetX,
      unit: "px"
    }),
    [value.offsetX]
  );

  const valueOffsetY = useMemo(
    (): Value<"px"> => ({
      number: value.offsetY,
      unit: "px"
    }),
    [value.offsetY]
  );

  const onChangeOffsetX = useCallback(
    ({ number }: { number: number }) => onOffsetXChange(number),
    [onOffsetXChange]
  );

  const onChangeOffsetY = useCallback(
    ({ number }: { number: number }) => onOffsetYChange(number),
    [onOffsetYChange]
  );

  return (
    <>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("OffsetX")} />
        <NumberSlider<"px">
          value={valueOffsetX}
          onChange={onChangeOffsetX}
          step={1}
          min={-359}
          max={359}
          units={units}
        />
      </OptionWrapper>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("OffsetY")} />
        <NumberSlider<"px">
          value={valueOffsetY}
          onChange={onChangeOffsetY}
          step={1}
          min={-359}
          max={359}
          units={units}
        />
      </OptionWrapper>
    </>
  );
};
