import classNames from "classnames";
import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { pipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { WithClassName, WithSize } from "visual/utils/options/attributes";
import { inputValue } from "visual/utils/react";

type Action = "increase" | "decrease" | "none";

export interface Props extends WithClassName, WithSize {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  spinner: boolean;
}

export const NumberComponent: FC<Props> = ({
  value,
  onChange,
  className,
  size = "auto",
  spinner = true,
  onIncrease,
  onDecrease
}) => {
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
  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    pipe(inputValue, Num.read, onChange),
    [onChange]
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
  }, [action, value, onChange]);

  return (
    <div className={_className}>
      <input
        className="brz-input"
        type="number"
        value={value ?? ""}
        min={-999999}
        max={999999}
        onChange={handleOnChange}
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
