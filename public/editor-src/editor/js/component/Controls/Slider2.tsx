import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import { read } from "visual/utils/math/number";
import { mCompose } from "visual/utils/value";
import { inputValue } from "visual/utils/react";

export type Props = WithClassName & {
  value: number;
  onChange: (v: number, meta: { editing: boolean }) => void;
  step: number;
  min: number;
  max: number;
};

export const Slider2: FC<Props> = ({
  value,
  onChange,
  className,
  min,
  max,
  step
}) => {
  const _onChange = useCallback(
    mCompose(v => onChange(v, { editing: true }), read, inputValue),
    [onChange]
  );
  const _onMouseUp = useCallback(
    mCompose(v => onChange(v, { editing: false }), read, inputValue),
    [onChange]
  );

  return (
    <input
      className={classNames("brz-ed-control--slider2", className)}
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={_onChange}
      onMouseUp={_onMouseUp}
    />
  );
};
