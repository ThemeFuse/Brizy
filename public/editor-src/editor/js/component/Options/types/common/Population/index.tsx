import React, { ReactElement } from "react";
import Input from "./Input";
import Select from "./Select";
import { isOptgroup } from "./utils";
import { Choices, OptGroup } from "./types/Choices";
import { Empty } from "visual/utils/string/specs";

export interface Props<T extends string | number> {
  choices: (Choices<T> | OptGroup<T>)[];
  value: T;
  onChange: (s: T | Empty) => void;
  renderUnset?: () => ReactElement;
}

export default function Population<T extends string | number>({
  choices,
  value,
  renderUnset,
  onChange
}: Props<T>): ReactElement {
  let input: ReactElement | undefined;

  if (value) {
    const activeItem = choices.find(item => {
      if (isOptgroup(item)) {
        return item.optgroup.find(item => item.value === value);
      }
      return item.value === value;
    });

    input = <Input value={activeItem?.title ?? ""} onChange={onChange} />;
  } else {
    input = renderUnset?.();
  }

  return (
    <>
      {input}
      <Select choices={choices} value={value} onChange={onChange} />
    </>
  );
}
