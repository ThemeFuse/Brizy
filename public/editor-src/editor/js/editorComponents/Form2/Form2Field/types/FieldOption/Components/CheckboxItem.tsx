import React from "react";
import { CheckGroupItem as CheckboxControlsItem } from "visual/component/Controls/CheckGroup/CheckGroupItem";
import EditorIcon from "visual/component/EditorIcon";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { CheckboxItemProps } from "./type";
import { FCC } from "visual/utils/react/types";
import { Obj } from "@brizy/readers";

const CheckboxItem: FCC<CheckboxItemProps> = ({
  value,
  handleInputChange,
  onRemove,
  active,
  handleChangeActive,
  renderCheckboxIconPreview,
  renderCheckboxIconEditor,
  isEditor,
  label,
  required,
  type
}) => {
  const _active = Obj.isObject(active);

  const handleCheckboxClick = () => {
    if (_active) {
      handleChangeActive({
        ...active,
        [value]: !active[value]
      });
    }
  };
  const isActive = _active ? active[value] : false;

  return isEditor ? (
    <CheckboxControlsItem
      className="brz-forms2__checkbox-option"
      value={value}
      isEditor={isEditor}
      renderIcons={renderCheckboxIconEditor}
      active={isActive}
      onClick={handleCheckboxClick}
    >
      <div className="brz-forms2__checkbox-option-name">
        <TextEditor
          className="brz-input"
          value={value}
          onChange={handleInputChange}
        />
        <span className="brz-span brz-invisible">{value}</span>
      </div>
      <div className="brz-forms2__checkbox-option-icon" onClick={onRemove}>
        <EditorIcon icon="nc-trash" />
      </div>
    </CheckboxControlsItem>
  ) : (
    <CheckboxControlsItem
      value={value}
      className="brz-forms2__checkbox-option"
      renderIcons={renderCheckboxIconPreview}
      isEditor={false}
      active={isActive}
      label={label}
      required={required}
      type={type}
    >
      <span className="brz-span brz-forms2__checkbox-option-name">{value}</span>
    </CheckboxControlsItem>
  );
};

export default CheckboxItem;
