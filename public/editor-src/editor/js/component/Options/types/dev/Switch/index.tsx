import React, { FC } from "react";
import { Switch as Control } from "visual/component/Controls/Switch2";
import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { Literal, read } from "visual/utils/types/Literal";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

export type Config = {
  on: Literal;
  off: Literal;
};

export type Props = Option.Props<SimpleValue<Literal>> &
  WithConfig<Config> &
  WithClassName;

export const Switch: FC<Props> & Option.OptionType<SimpleValue<Literal>> = ({
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

const getModel: Option.GetModel<SimpleValue<Literal>> = get => ({
  value: read(get("value"))
});

const getElementModel: Option.GetElementModel<SimpleValue<Literal>> = (
  values,
  get
) => {
  return {
    [get("value")]: values.value
  };
};

Switch.getModel = getModel;

Switch.getElementModel = getElementModel;

Switch.defaultValue = { value: "" };
