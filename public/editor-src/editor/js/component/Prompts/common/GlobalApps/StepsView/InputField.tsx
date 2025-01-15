import React, { ChangeEvent, ReactElement, useCallback } from "react";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { RadioItemField } from "./Radio/RadioItemField";
import { InputFieldProps } from "./types";

export const InputField = (props: InputFieldProps): ReactElement => {
  const {
    field: { title, name, value, type, choices, description },
    onChange,
    handleKeyDown
  } = props;
  const handleInputChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange(target.value, name);
    },
    [name, onChange]
  );

  if (type === "radio" && choices) {
    return (
      <RadioItemField
        choices={choices}
        name={name}
        onChange={onChange}
        isEditor={true}
      />
    );
  }

  return (
    <InputPlaceholder
      required
      title={title}
      value={value}
      description={description}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};
