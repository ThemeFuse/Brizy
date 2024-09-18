import React, { ReactElement } from "react";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";
import { WithOnChange, WithValue } from "visual/types/attributes";

type Props = WithValue<number> & WithOnChange<number>;

export const Width = ({ onChange, value }: Props): ReactElement => {
  return (
    <AutoCorrectingInput
      className="brz-input"
      min={0}
      max={9999}
      step={1}
      value={value}
      onChange={onChange}
    />
  );
};
