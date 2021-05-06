import React, { ReactElement, FC, useState } from "react";
import {
  MultiSelect as Control,
  MultiSelectItem as ControlItem
} from "visual/component/Controls/MultiSelect2";
import { MultiSelectItemProps as ControlItemProps } from "visual/component/Controls/MultiSelect2/types";
import { toElement, searchChoices, mergeChoices, valueChoices } from "./utils";
import { ValueItem, Props, ChoicesSync } from "./types";

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
  const vChoices = valueChoices(value, choices);
  const sChoices = searchChoices(search, choices);

  return (
    <Control<ValueItem>
      value={value}
      placeholder={placeholder}
      search={config?.search ?? false}
      searchIsEmpty={sChoices.length === 0}
      onChange={(value): void => {
        onChange(toElement(value));
      }}
      onSearchChange={setSearch}
    >
      {mergeChoices(vChoices, sChoices).map(choiceToItem)}
    </Control>
  );
};
