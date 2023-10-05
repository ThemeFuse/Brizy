import React, { MouseEvent, ReactElement } from "react";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { Edit } from "./Edit";
import { Title } from "./Title";

export interface Props<T extends string> {
  value: T;
  // [ active, selected, onClick ] props are send via props from Select control
  active?: boolean;
  selected?: boolean;
  onClick?: VoidFunction;
  onDelete?: (t: T) => void;
  onEdit?: (t: string) => void;
}

export const ItemEdit = <T extends string>(props: Props<T>): ReactElement => {
  const { value, active, selected, onDelete, onEdit, onClick } = props;

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.(value);
  };

  return (
    <SelectItem
      active={active}
      selected={selected}
      title={value}
      value={value}
      onClick={onClick}
    >
      {selected ? (
        value
      ) : (
        <div className="brz-ed-popup-two__select-item">
          {typeof onEdit === "function" ? (
            <Edit value={value} onChange={onEdit} />
          ) : (
            <Title title={value} />
          )}
          {typeof onDelete === "function" && (
            <span
              title={t("Remove")}
              className="brz-ed-popup-two__select-trash"
            >
              <EditorIcon icon="nc-trash" onClick={handleDelete} />
            </span>
          )}
        </div>
      )}
    </SelectItem>
  );
};
