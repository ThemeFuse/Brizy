import React, { ReactElement } from "react";
import { Switch } from "visual/component/Controls/Switch2";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";

export interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export const Switcher = ({ value, onChange, label }: Props): ReactElement => {
  return (
    <OptionWrapper display={"inline"} className={"brz-ed-option"}>
      <OptionLabel label={label} />
      <Switch value={value} onChange={onChange} />
    </OptionWrapper>
  );
};
