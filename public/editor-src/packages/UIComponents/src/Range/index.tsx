import classNames from "classnames";
import { Range as RCRange } from "rc-slider";
import React, { FC } from "react";
import { Props } from "./types";

export const Range: FC<Props> = ({
  className: _className,
  min,
  max,
  step,
  startPointer,
  finishPointer,
  handle,
  railStyle,
  onChange
}) => {
  const className = classNames("brz-ed-control__range", _className);

  return (
    <div className={className}>
      <RCRange
        count={1}
        defaultValue={[startPointer, finishPointer]}
        min={min}
        max={max}
        step={step}
        handle={handle}
        railStyle={railStyle}
        onChange={onChange}
      />
    </div>
  );
};
