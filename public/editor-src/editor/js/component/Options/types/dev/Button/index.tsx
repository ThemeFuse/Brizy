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

const getModel: Option.GetModel<undefined> = () => undefined;
const getElementModel: Option.GetElementModel<undefined> = () => ({});

Button.getModel = getModel;
Button.getElementModel = getElementModel;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
Button.defaultValue = undefined;
