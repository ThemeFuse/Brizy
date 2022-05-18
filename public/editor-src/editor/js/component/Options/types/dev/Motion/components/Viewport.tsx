import React, { ReactElement, useCallback } from "react";
import { mPipe, pass } from "fp-utilities";
import { OnChange } from "visual/component/Options/Type";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { RangeSlider } from "visual/component/Controls/RangeSlider";
import { useDebouncedOnChange } from "visual/component/hooks";
import * as Unit from "visual/utils/math/Unit";
import { t } from "visual/utils/i18n";
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
    mPipe(divide, pass(Unit.is), top => construct(top, bottom), onChange),
    [onChange, bottom]
  );
  const _onChangeEnd = useCallback(
    mPipe(divide, pass(Unit.is), bottom => construct(top, bottom), onChange),
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
