import React from "react";
import * as Option from "visual/component/Options/Type";
import { Button as Control } from "visual/component/Controls/Button";
import { WithConfig } from "visual/utils/options/attributes";

export interface Config {
  text: string;
  icon: string;
  reverse?: boolean;
}

export interface Props extends Option.Props<undefined>, WithConfig<Config> {
  onClick: VoidFunction;
}

export const Button: React.FC<Props> & Option.OptionType<undefined> = ({
  label,
  onClick,
  config
}) => {
  return (
    <>
      {label}
      <Control
        onClick={onClick}
        label={config?.text}
        icon={config?.icon}
        reverse={config?.reverse}
      />
    </>
  );
};

const getModel: Option.FromElementModel<undefined> = () => undefined;
const getElementModel: Option.ToElementModel<undefined> = () => ({});

Button.fromElementModel = getModel;
Button.toElementModel = getElementModel;

// @ts-expect-error: Variable 'defaultValue' implicitly has an 'any' type
Button.defaultValue = undefined;
