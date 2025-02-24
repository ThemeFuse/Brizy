import React, { forwardRef } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { SelectItemProps } from "./type";

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  (
    { value, handleSelectInputChange, onRemove, isEditor, renderIconTrash },
    ref
  ) => {
    return isEditor ? (
      <>
        <div className="brz-forms2__select-item" ref={ref}>
          <div className="brz-forms2__select-item__input">
            <input
              className="brz-input"
              value={value}
              onChange={handleSelectInputChange}
            />
          </div>
          {renderIconTrash && (
            <div className="brz-forms2__select-item__icon" onClick={onRemove}>
              <EditorIcon icon="nc-trash" />
            </div>
          )}
        </div>
      </>
    ) : (
      <option value={value}>{value}</option>
    );
  }
);

export default SelectItem;
