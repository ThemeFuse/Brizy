import React, { ReactElement, useCallback } from "react";
import { findDeep } from "visual/utils/object";
import { Empty } from "visual/utils/string/specs";
import Input from "./Input";
import Select from "./Select";
import { Choices, OptGroup } from "./types/Choices";
import { isOptgroup } from "./utils";

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

  const handleRemove = useCallback(() => onChange(""), [onChange]);

  if (value) {
    const activeItem: Choices<T> | null = findDeep(
      choices,
      (choice: Choices<T> | OptGroup<T>): boolean => {
        return !isOptgroup(choice) && choice.value === value;
      }
    ).obj;

    input = <Input value={activeItem?.title ?? ""} onRemove={handleRemove} />;
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
