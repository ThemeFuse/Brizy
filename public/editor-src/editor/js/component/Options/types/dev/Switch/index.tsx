import React, { FC } from "react";
import { Switch as Control } from "visual/component/Controls/Switch2";
import * as Option from "visual/component/Options/Type";
import { Literal, read } from "visual/utils/types/Literal";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

export type Config = {
  on: Literal;
  off: Literal;
};

export type Props = Option.Props<Literal, { value: Literal }> &
  WithConfig<Config> &
  WithClassName;

export const Switch: FC<Props> & Option.OptionType<Literal> = ({
  onChange,
  config,
  className,
  value
}) => {
  const on = config?.on ?? "on";
  const off = config?.off ?? "off";
  return (
    <Control
      className={className}
      value={value === on}
      onChange={(v): void => onChange({ value: v ? on : off })}
    />
  );
};

const getModel: Option.GetModel<Literal> = get => read(get("value")) ?? "";

Switch.getModel = getModel;
