import classNames from "classnames";
import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { IconsName } from "../EditorIcon/types";
import { EditorIcon } from "..";
import * as Num from "../utils/number";
import { pipe } from "../utils/pipe";
import { inputValue } from "../utils/react";
import { Action, Props } from "./types";

const baseClass = "brz-ed-control__number";

export const Number: FC<Props> = ({
  value,
  onChange,
  className,
  size = "auto",
  showArrows = true,
  onIncrease,
  onDecrease
}) => {
  const ref = useRef<NodeJS.Timeout>();
  const [action, setAction] = useState<Action>("none");
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
    (e) => pipe(inputValue, Num.read, onChange)(e),
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
  }, [action, onIncrease, onDecrease]);

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
      {showArrows ? (
        <div className={`${baseClass}--arrows`}>
          <div
            className={`${baseClass}--up`}
            onClick={onIncrease}
            onMouseDown={handleIncrease}
            onMouseUp={clear}
          >
            <EditorIcon icon={IconsName.StreUp} />
          </div>
          <div
            className={`${baseClass}--down`}
            onClick={onDecrease}
            onMouseDown={handleDecrease}
            onMouseUp={clear}
          >
            <EditorIcon icon={IconsName.StreDown} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
