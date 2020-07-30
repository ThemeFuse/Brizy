import React, { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput/index";
import {
  WithClassName,
  WithOnChange,
  WithSize,
  WithValue
} from "visual/utils/options/attributes";
import EditorIcon from "visual/component/EditorIcon";
import { clamp } from "visual/utils/math";

type Action = "increase" | "decrease" | "none";

export type Props = WithClassName &
  WithValue<number> &
  WithOnChange<number> &
  WithSize & {
    step: number;
    min?: number;
    max?: number;
    spinner: boolean;
  };

export const Number: FC<Props> = ({
  value,
  onChange,
  className,
  min = -99999,
  max = 99999,
  size = "auto",
  step,
  spinner = true
}) => {
  const ref = useRef<NodeJS.Timeout>();
  const [action, setAction] = useState<Action>("none");
  const baseClass = "brz-ed-control__number";
  const _className = classNames(baseClass, `${baseClass}--${size}`, className);
  const clear = (): void => setAction("none");
  const changeValue = (v: number): void => {
    const _v = clamp(v, min, max);
    if (_v !== value) {
      onChange(_v);
    }
  };
  const actionFn = (a: Action): ((v: number) => number) => {
    switch (a) {
      case "increase":
        return (v: number): number => v + step;
      case "decrease":
        return (v: number): number => v - step;
      case "none":
        return (v: number): number => v;
    }
  };

  useEffect(() => {
    if (action !== "none") {
      ref.current && clearInterval(ref.current);
      ref.current = setInterval(
        () => changeValue(actionFn(action)(value)),
        150
      );
    } else {
      ref.current && clearInterval(ref.current);
    }
  }, [action, value, onChange]);

  return (
    <div className={_className}>
      <AutoCorrectingInput
        className="brz-input"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
      {spinner ? (
        <div className={`${baseClass}--arrows`}>
          <div
            className={`${baseClass}--up`}
            onClick={(): void => changeValue(value + step)}
            onMouseDown={(): void => setAction("increase")}
            onMouseUp={clear}
          >
            <EditorIcon icon="nc-stre-up" />
          </div>
          <div
            className={`${baseClass}--down`}
            onClick={(): void => changeValue(value - step)}
            onMouseDown={(): void => setAction("decrease")}
            onMouseUp={clear}
          >
            <EditorIcon icon="nc-stre-down" />
          </div>
        </div>
      ) : null}
    </div>
  );
};
