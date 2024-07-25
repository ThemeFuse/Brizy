import React, { ReactElement, useCallback, useMemo } from "react";
import {
  Props as NSProps,
  NumberSlider
} from "visual/component/Controls/NumberSlider";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { OnChange } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";

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
  const _onChange = useCallback(
    (v: NSProps<"s">["value"]) => onChange(v.number * 1000),
    [onChange]
  );
  return (
    <OptionWrapper display={"inline"} className={"brz-ed-option"}>
      <OptionLabel label={t("Duration")} />
      <NumberSlider<"s">
        className={"brz-ed__control--number-slider--medium"}
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
