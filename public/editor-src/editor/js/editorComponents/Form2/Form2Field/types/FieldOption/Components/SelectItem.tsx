import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { FCC } from "visual/utils/react/types";
import { SelectItemProps } from "./type";

const SelectItem: FCC<SelectItemProps> = ({
  value,
  handleSelectInputChange,
  onRemove,
  isEditor,
  renderIconTrash
}) => {
  return isEditor ? (
    <>
      <div className="brz-forms2__select-item">
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
};

export default SelectItem;
