import React, { FC, ReactElement, useCallback } from "react";
import Radio, { RadioItem } from "visual/component/Controls/Radio";
import { RadioItemProps } from "../types";

export const RadioItemField: FC<RadioItemProps> = ({
  choices,
  name,
  onChange
}): ReactElement => {
  const handleRadioChange = useCallback(
    (value: string) => {
      onChange(value, name);
    },
    [name, onChange]
  );

  return (
    <Radio
      className="brz-ed-popup-integrations-option__radio"
      name={name}
      onChange={handleRadioChange}
      defaultValue={choices[0].id}
    >
      {choices.map(({ name, id }) => (
        <RadioItem key={id} value={id}>
          {name}
        </RadioItem>
      ))}
    </Radio>
  );
};
