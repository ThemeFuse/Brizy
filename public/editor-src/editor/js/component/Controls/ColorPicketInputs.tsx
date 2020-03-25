import React, { FC, ReactNode } from "react";
import { InputHex } from "visual/component/Controls/InputHex";
import { OnChange } from "visual/component/Options/Type";

export type Props = {
  value: string;
  onChange: OnChange<string>;
  children?: ReactNode;
};

export const ColorPickerInputs: FC<Props> = ({ value, onChange, children }) => {
  return (
    <div className="brz-ed-control__color-picker-inputs">
      <InputHex value={value} onChange={onChange} />
      {children}
    </div>
  );
};
