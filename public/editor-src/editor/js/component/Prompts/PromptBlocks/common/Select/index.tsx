import React, { ReactElement } from "react";
import Select from "visual/component/Controls/Select";
import { ItemAdd } from "./ItemAdd";
import { ItemEdit } from "./ItemEdit";

export interface Props<T extends string> {
  value?: T;
  choices: Array<{ item: T; deletable?: boolean; editable?: boolean }>;
  onChange: (t: T) => void;
  onDelete?: (t: T) => void;
  onEdit?: (tModified: string, tOriginal: string) => void;
  onAdd?: (t: string) => void;
}

export const Control = <T extends string>(props: Props<T>): ReactElement => {
  const { value, choices, onChange, onDelete, onEdit, onAdd } = props;

  return (
    <Select
      defaultValue={value}
      className="brz-control__select--dark"
      fullWidth={true}
      maxItems="6"
      itemHeight="30"
      onChange={onChange}
    >
      {choices.map((choice, index) => (
        <ItemEdit
          key={index}
          value={choice.item}
          onDelete={choice.deletable ? onDelete : undefined}
          onEdit={
            choice.editable && typeof onEdit === "function"
              ? (t) => onEdit(choice.item, t)
              : undefined
          }
        />
      ))}
      {typeof onAdd === "function" && <ItemAdd onAdd={onAdd} />}
    </Select>
  );
};
