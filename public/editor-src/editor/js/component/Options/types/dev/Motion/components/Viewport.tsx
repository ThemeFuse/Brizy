import { mPipe, pass } from "fp-utilities";
import React, { ReactElement, useCallback } from "react";
import { RangeSlider } from "visual/component/Controls/RangeSlider";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { useDebouncedOnChange } from "visual/component/hooks";
import { t } from "visual/utils/i18n";
import * as Unit from "visual/utils/math/Unit";
import { Viewport as ViewportType, construct } from "../types/Viewport";

const divide = (v: number): number => v / 100;

export type Props = {
  value: ViewportType;
  onChange: OnChange<ViewportType>;
};

export function Viewport({
  value: { top, bottom },
  onChange
}: Props): ReactElement {
  const _onChangeStart = useCallback(
    (x) =>
      mPipe(
        divide,
        pass(Unit.is),
        (top) => construct(top, bottom),
        onChange
      )(x),
    [onChange, bottom]
  );
  const _onChangeEnd = useCallback(
    (x) =>
      mPipe(
        divide,
        pass(Unit.is),
        (bottom) => construct(top, bottom),
        onChange
      )(x),
    [onChange, top]
  );
  const [start, handleStart] = useDebouncedOnChange<number>(
    top * 100,
    _onChangeStart,
    100
  );
  const [end, handleEnd] = useDebouncedOnChange<number>(
    bottom * 100,
    _onChangeEnd,
    100
  );

  return (
    <OptionWrapper className={"brz-ed-option"}>
      <RangeSlider
        start={Math.trunc(start)}
        onChangeStart={handleStart}
        end={Math.trunc(end)}
        onChangeEnd={handleEnd}
        step={1}
        min={0}
        max={100}
        startLabel={t("Start")}
        endLabel={t("End")}
      />
    </OptionWrapper>
  );
}
