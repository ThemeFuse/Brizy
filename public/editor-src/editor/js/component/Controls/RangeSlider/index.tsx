import classNames from "classnames";
import React, { ReactElement, useCallback } from "react";
import { Slider2 } from "visual/component/Controls/Slider2";
import { Label } from "visual/component/Label";
import { clamp } from "visual/utils/math";
import { WithClassName } from "visual/utils/options/attributes";

export interface Props extends WithClassName {
  start: number;
  onChangeStart: (n: number) => void;
  end: number;
  onChangeEnd: (n: number) => void;
  unit?: string | number;
  step: number;
  min: number;
  max: number;
  startLabel?: string;
  endLabel?: string;
}

export function RangeSlider({
  start,
  end,
  unit,
  onChangeStart,
  onChangeEnd,
  className,
  min,
  max,
  step,
  startLabel,
  endLabel
}: Props): ReactElement {
  const handleFrom = useCallback(
    (start: number): void => onChangeStart(clamp(start, min, end)),
    [onChangeStart, end, min]
  );
  const handleTo = useCallback(
    (end: number): void => onChangeEnd(clamp(end, start, max)),
    [onChangeEnd, max, start]
  );

  const leftOffset = (100 * start) / max;
  const rightOffset = (100 * end) / max;

  return (
    <div className={classNames("brz-ed__control--range-slider", className)}>
      {startLabel ? (
        <Label className="brz-ed__control--range-slider__left-label">
          {startLabel}
        </Label>
      ) : null}
      <div className="brz-ed__control--range-slider__inputs">
        <div className="brz-ed__control--range-slider__sliders">
          <Slider2
            value={start}
            onChange={handleFrom}
            step={step}
            min={min}
            max={max}
          />
          <Slider2
            className={"brz-ed__control--range-slider__to"}
            value={end}
            onChange={handleTo}
            step={step}
            min={min}
            max={max}
          />
        </div>
        <div className="brz-ed__control--range-slider__values">
          <span
            className="brz-ed__control--range-slider__values__from"
            style={{ marginLeft: `calc(${leftOffset}% - 9px)` }}
          >
            {start}
            {unit}
          </span>
          <span
            className="brz-ed__control--range-slider__values__to"
            style={{ marginRight: `calc(100% - ${rightOffset}% - 9px)` }}
          >
            {end}
            {unit}
          </span>
        </div>
      </div>
      {endLabel ? (
        <Label className="brz-ed__control--range-slider__right-label">
          {endLabel}
        </Label>
      ) : null}
    </div>
  );
}
