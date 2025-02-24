import React, { forwardRef } from "react";
import { RadioItem as RadioControlsItem } from "visual/component/Controls/Radio";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import { RadioItemProps } from "./type";

const RadioItem = forwardRef<HTMLDivElement, RadioItemProps>(
  (
    {
      value,
      handleInputChange,
      handleRadioIconClick,
      onRemove,
      active,
      label,
      placeholder,
      isEditor,
      name
    },
    ref
  ) => {
    return isEditor ? (
      <>
        <RadioControlsItem
          className="brz-forms2__radio-option"
          value={value}
          name={name}
          checkIcon="check-circle-on"
          unCheckIcon="check-circle-off"
          active={active}
          onClick={handleRadioIconClick}
          isEditor={true}
        >
          <div className="brz-forms2__radio-option-name" ref={ref}>
            <TextEditor
              className="brz-input"
              value={value}
              onChange={handleInputChange}
            />
            <span className="brz-span brz-invisible">{label}</span>
          </div>
          <div className="brz-forms2__radio-option-icon" onClick={onRemove}>
            <EditorIcon icon="nc-trash" />
          </div>
        </RadioControlsItem>
      </>
    ) : (
      <RadioControlsItem
        value={value}
        name={name}
        label={label}
        placeholder={placeholder}
        className="brz-forms2__radio-option"
        checkIcon="check-circle-on"
        unCheckIcon="check-circle-off"
        active={active}
        isEditor={false}
      >
        <span className="brz-span brz-forms2__radio-option-name">{value}</span>
      </RadioControlsItem>
    );
  }
);

export default RadioItem;
