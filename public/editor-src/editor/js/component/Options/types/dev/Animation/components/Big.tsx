import React, { ReactElement } from "react";
import { t } from "visual/utils/i18n";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OptionLabel } from "visual/component/OptionLabel";
import { Switch } from "visual/component/Controls/Switch2";

export interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export const Big = ({ value, onChange }: Props): ReactElement => {
  return (
    <OptionWrapper display={"inline"} className={"brz-ed-option"}>
      <OptionLabel label={t("Big")} />
      <Switch value={value} onChange={onChange} />
    </OptionWrapper>
  );
};
