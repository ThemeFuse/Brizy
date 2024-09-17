import { FCC } from "visual/utils/react/types";
import { Props } from "./types";
import { t } from "visual/utils/i18n";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useState
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import classNames from "classnames";

export const AddOption: FCC<Props> = ({
  onAdd,
  wrapperClassName,
  iconClassName,
  inputWrapperClassName
}) => {
  const [value, setValue] = useState("");

  const handleChangeValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    []
  );

  const handleAdd = useCallback(() => {
    if (value && value.trim()) {
      onAdd(value);
      setValue("");
    }
  }, [value, onAdd]);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        handleAdd();
      }
    },
    [handleAdd]
  );

  const inputWrapperClassNames = classNames("brz-span", inputWrapperClassName);

  return (
    <div className={wrapperClassName}>
      <span className={inputWrapperClassNames}>
        <input
          type="text"
          className="brz-input"
          placeholder={t("Add new option")}
          value={value}
          onChange={handleChangeValue}
          onKeyUp={handleKeyUp}
        />
      </span>
      <div className={iconClassName} onClick={handleAdd}>
        <EditorIcon icon="nc-arrow-right" />
      </div>
    </div>
  );
};
