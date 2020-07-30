import React, { FC } from "react";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";
import { WithOnChange, WithValue } from "visual/utils/options/attributes";

type Props = WithValue<number> & WithOnChange<number>;

export const Width: FC<Props> = ({ onChange, value }) => {
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
