import React, { ReactElement, useCallback, useMemo } from "react";
import { OnChange } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import {
  NumberSlider,
  Props as NSProps
} from "visual/component/Controls/NumberSlider";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OptionLabel } from "visual/component/OptionLabel";

export interface Props {
  value: number;
  onChange: OnChange<number>;
}

const units: NSProps<"s">["units"] = [{ title: "s", value: "s" }];

export const Duration = ({ value, onChange }: Props): ReactElement => {
  const v = useMemo<NSProps<"s">["value"]>(
    () => ({ number: value / 1000, unit: "s" }),
    [value]
  );
  const _onChange = useCallback(v => onChange(v.number * 1000), [onChange]);
  return (
    <OptionWrapper display={"inline"} className={"brz-ed-option"}>
      <OptionLabel label={t("Duration")} />
      <NumberSlider<"s">
        value={v}
        onChange={_onChange}
        step={0.1}
        min={0.0}
        max={5.0}
        units={units}
      />
    </OptionWrapper>
  );
};
