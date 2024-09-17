import classNames from "classnames";
import { Range as RCRange } from "rc-slider";
import React, { CSSProperties, ReactNode } from "react";
import { WithClassName, WithOnChange } from "visual/types/attributes";

export type Props = WithClassName &
  WithOnChange<number[]> & {
    min: number;
    max: number;
    step: number;
    startPointer: number;
    finishPointer: number;
    allowCross?: boolean;
    railStyle?: CSSProperties;
    handle?: (props: unknown) => ReactNode;
  };

export const Range = ({
  className: _className,
  min,
  max,
  step,
  startPointer,
  finishPointer,
  allowCross,
  handle,
  railStyle,
  onChange
}: Props): JSX.Element => {
  const className = classNames("brz-ed-control__range", _className);

  return (
    <div className={className}>
      <RCRange
        count={1}
        defaultValue={[startPointer, finishPointer]}
        min={min}
        max={max}
        step={step}
        allowCross={allowCross}
        handle={handle}
        railStyle={railStyle}
        onChange={onChange}
      />
    </div>
  );
};

export default Range;
