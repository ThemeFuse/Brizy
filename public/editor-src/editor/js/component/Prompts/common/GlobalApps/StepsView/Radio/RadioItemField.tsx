import React, { ReactElement, useCallback } from "react";
import Radio, { RadioItem } from "visual/component/Controls/Radio";
import { RadioItemProps } from "../types";

export const RadioItemField = ({
  choices,
  name,
  onChange,
  isEditor
}: RadioItemProps): ReactElement => {
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
        <RadioItem key={id} value={id} isEditor={isEditor}>
          {name}
        </RadioItem>
      ))}
    </Radio>
  );
};
