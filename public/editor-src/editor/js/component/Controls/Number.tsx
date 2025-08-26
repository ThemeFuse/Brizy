import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import NumberControl from "visual/component/Controls/AutoCorrectingInput";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName, WithSize } from "visual/types/attributes";

type Action = "increase" | "decrease" | "none";

export interface Props extends WithClassName, WithSize {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  spinner: boolean;
  min: number;
  max: number;
}

export const NumberComponent = ({
  value,
  onChange,
  className,
  size = "auto",
  spinner = true,
  onIncrease,
  onDecrease,
  min,
  max
}: Props): JSX.Element => {
  const ref = useRef<NodeJS.Timeout>();
  const [action, setAction] = useState<Action>("none");
  const baseClass = "brz-ed-control__number";
  const _className = classNames(baseClass, `${baseClass}--${size}`, className);
  const clear = useCallback((): void => setAction("none"), [setAction]);
  const handleIncrease = useCallback(
    (): void => setAction("increase"),
    [setAction]
  );
  const handleDecrease = useCallback(
    (): void => setAction("decrease"),
    [setAction]
  );
  const handleOnChange = useCallback(
    (n: number): void => {
      if (n !== value) {
        onChange(n);
      }
    },
    [onChange, value]
  );

  useEffect((): undefined => {
    switch (action) {
      case "increase":
        ref.current && clearInterval(ref.current);
        ref.current = setInterval(onIncrease, 150);
        return undefined;
      case "decrease":
        ref.current && clearInterval(ref.current);
        ref.current = setInterval(onDecrease, 150);
        return undefined;
      case "none": {
        ref.current && clearInterval(ref.current);
        return undefined;
      }
    }
  }, [action, onDecrease, onIncrease]);

  return (
    <div className={_className}>
      <NumberControl
        className="brz-input"
        value={value}
        onChange={handleOnChange}
        min={min}
        max={max}
        step={1}
      />
      {spinner ? (
        <div className={`${baseClass}--arrows`}>
          <div
            className={`${baseClass}--up`}
            onClick={onIncrease}
            onMouseDown={handleIncrease}
            onMouseUp={clear}
          >
            <EditorIcon icon="nc-stre-up" />
          </div>
          <div
            className={`${baseClass}--down`}
            onClick={onDecrease}
            onMouseDown={handleDecrease}
            onMouseUp={clear}
          >
            <EditorIcon icon="nc-stre-down" />
          </div>
        </div>
      ) : null}
    </div>
  );
};
