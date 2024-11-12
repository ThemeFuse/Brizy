import React from "react";
import { CheckGroupItem as CheckboxControlsItem } from "visual/component/Controls/CheckGroup/CheckGroupItem";
import EditorIcon from "visual/component/EditorIcon";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { CheckboxItemProps } from "./type";
import { FCC } from "visual/utils/react/types";
import { Obj } from "@brizy/readers";
import Link from "visual/component/Link";

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
  type,
  isCheckboxWithLink,
  typeCheckbox,
  hrefCheckbox,
  targetCheckbox,
  relCheckbox,
  slideCheckbox,
  className
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
      <div className={`brz-forms2__checkbox-option-name ${className}`}>
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
      {isCheckboxWithLink ? (
        <Link
          className={`brz-forms2__checkbox-option-name brz-a ${className}`}
          type={typeCheckbox}
          href={hrefCheckbox}
          target={targetCheckbox}
          rel={relCheckbox}
          slide={slideCheckbox}
        >
          {value}
        </Link>
      ) : (
        <span className="brz-forms2__checkbox-option-name brz-span">
          {value}
        </span>
      )}
    </CheckboxControlsItem>
  );
};

export default CheckboxItem;
