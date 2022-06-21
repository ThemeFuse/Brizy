import React, { ReactElement, FC, useState, useCallback } from "react";
import {
  MultiSelect as Control,
  MultiSelectItem as ControlItem
} from "visual/component/Controls/MultiSelect2";
import { MultiSelectItemProps as ControlItemProps } from "visual/component/Controls/MultiSelect2/types";
import { searchChoices } from "./utils";
import { ValueItem, Value, Props, ChoicesSync } from "./types";
import { OnChange } from "visual/component/Options/Type";

function choiceToItem({
  value,
  title
}: ChoicesSync[number]): ReactElement<ControlItemProps<ValueItem>> {
  return <ControlItem<ValueItem> key={value} title={title} value={value} />;
}

export const Sync: FC<Omit<Props, "choices"> & { choices: ChoicesSync }> = ({
  choices,
  value: { value },
  placeholder,
  config,
  onChange
}) => {
  const [search, setSearch] = useState("");
  const sChoices = searchChoices(search, choices);
  const _onChange = useCallback<OnChange<Value>>(value => onChange({ value }), [
    onChange
  ]);

  return (
    <Control<ValueItem>
      value={value}
      placeholder={placeholder}
      search={config?.search ?? false}
      searchIsEmpty={sChoices.length === 0}
      onChange={_onChange}
      onSearchChange={setSearch}
    >
      {sChoices.map(choiceToItem)}
    </Control>
  );
};
