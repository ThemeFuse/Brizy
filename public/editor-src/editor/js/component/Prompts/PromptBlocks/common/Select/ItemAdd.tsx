import classnames from "classnames";
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  ReactElement,
  useState
} from "react";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

export interface Props {
  onAdd: (v: string) => void;
}

export const ItemAdd = (props: Props): ReactElement => {
  const { onAdd } = props;
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleAdd = () => {
    const _value = value.trim();
    if (_value) {
      onAdd(_value);
      setValue("");
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleKeyPress: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };
  const className = classnames("brz-ed-popup-two__select-item", {
    "brz-ed-popup-two__select--error": error
  });

  return (
    <SelectItem>
      <div className={className}>
        <span className="brz-ed-popup-two__select-add">
          <EditorIcon icon="nc-add" onClick={handleAdd} />
        </span>
        <input
          className="brz-ed-popup-two__select-input"
          type="text"
          placeholder={t("Add new")}
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </SelectItem>
  );
};
