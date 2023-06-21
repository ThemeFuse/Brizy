import classNames from "classnames";
import React, { FC, useCallback } from "react";
import { read } from "visual/utils/math/number";
import { WithClassName } from "visual/utils/options/attributes";
import { inputValue } from "visual/utils/react";
import { mCompose } from "visual/utils/value";

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
    (v) => mCompose((v) => onChange(v, { editing: true }), read, inputValue)(v),
    [onChange]
  );
  const _onMouseUp = useCallback(
    (v) =>
      mCompose((v) => onChange(v, { editing: false }), read, inputValue)(v),
    [onChange]
  );

  return (
    <input
      className={classNames("brz-input brz-ed-control--slider2", className)}
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
