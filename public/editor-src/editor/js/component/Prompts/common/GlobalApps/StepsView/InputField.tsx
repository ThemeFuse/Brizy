import React, { ChangeEvent, ReactElement, useCallback } from "react";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { RadioItemField } from "./Radio/RadioItemField";
import { InputFieldProps } from "./types";

export const InputField = ({
  field: { title, name, value, type, choices },
  onChange,
  handleKeyDown
}: InputFieldProps): ReactElement => {
  const handleInputChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange(target.value, name);
    },
    [name, onChange]
  );

  if (type === "radio" && choices) {
    return <RadioItemField choices={choices} name={name} onChange={onChange} />;
  }

  return (
    <InputPlaceholder
      title={title}
      required
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};
