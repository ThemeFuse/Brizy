import React, { ReactElement, useCallback, useState } from "react";
import {
  MultiSelect as Control,
  MultiSelectItem as ControlItem
} from "visual/component/Controls/MultiSelect2";
import { MultiSelectItemProps as ControlItemProps } from "visual/component/Controls/MultiSelect2/types";
import { OnChange } from "visual/component/Options/Type";
import { ChoicesSync, Props, Value, ValueItem } from "./types";
import { searchChoices } from "./utils";

function choiceToItem({
  value,
  title
}: ChoicesSync[number]): ReactElement<ControlItemProps<ValueItem>> {
  return <ControlItem<ValueItem> key={value} title={title} value={value} />;
}

export const Sync = ({
  choices,
  value: { value },
  placeholder,
  config,
  onChange
}: Omit<Props, "choices"> & {
  choices: ChoicesSync;
}): ReactElement => {
  const { useAsSimpleSelect = false, showArrow = false } = config ?? {};

  const [search, setSearch] = useState("");
  const sChoices = searchChoices(search, choices);
  const _onChange = useCallback<OnChange<Value>>(
    (value) => onChange({ value }),
    [onChange]
  );

  return (
    <Control<ValueItem>
      value={value}
      placeholder={placeholder}
      search={config?.search ?? false}
      searchIsEmpty={sChoices.length === 0}
      useAsSimpleSelect={useAsSimpleSelect}
      showArrow={showArrow}
      onChange={_onChange}
      onSearchChange={setSearch}
    >
      {sChoices.map(choiceToItem)}
    </Control>
  );
};
