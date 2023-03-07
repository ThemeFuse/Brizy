import React, { FC } from "react";
import { Switch as Control } from "visual/component/Controls/Switch";
import { Props as OptionProps } from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";

export type Config = {
  on: Literal;
  off: Literal;
};

export type Props = OptionProps<SimpleValue<Literal>> &
  WithConfig<Config> &
  WithClassName;

export const Switch: FC<Props> = ({
  onChange,
  config,
  className,
  value: { value },
  label
}) => {
  const on = config?.on ?? "on";
  const off = config?.off ?? "off";
  return (
    <>
      {label}
      <Control
        className={className}
        value={value === on}
        onChange={(v): void => onChange({ value: v ? on : off })}
      />
    </>
  );
};
