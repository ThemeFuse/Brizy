import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  ReactElement
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

export interface Props {
  value: string;
  onChange: (v: string) => void;
  onAdd: VoidFunction;
}

export const TagEditable = (props: Props): ReactElement => {
  const { value, onChange, onAdd } = props;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };

  const handleKeyPress: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      onAdd();
    }
  };

  return (
    <div className="brz-ed-popup-two-block__bottom-control-categories-element">
      <EditorIcon icon="nc-plus2" onClick={onAdd} />
      <input
        className="brz-input"
        placeholder={t("Add new")}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};
