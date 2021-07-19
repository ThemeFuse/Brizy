import React, { ReactElement } from "react";
import Input from "./Input";
import Select from "./Select";
import { isOptgroup } from "./utils";
import { Choices, OptGroup } from "./types/Choices";
import { Empty } from "visual/utils/string/specs";
import { findDeep } from "visual/utils/object";

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
    const activeItem: Choices<T> | null = findDeep(
      choices,
      (choice: Choices<T> | OptGroup<T>): boolean => {
        return !isOptgroup(choice) && choice.value === value;
      }
    ).obj;

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
