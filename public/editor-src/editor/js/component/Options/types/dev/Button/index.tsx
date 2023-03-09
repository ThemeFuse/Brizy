import React from "react";
import { Button as Control } from "visual/component/Controls/Button";
import * as Option from "visual/component/Options/Type";
import { WithConfig } from "visual/utils/options/attributes";

export interface Config {
  text: string;
  icon: string;
  reverse?: boolean;
}

export interface Props extends Option.Props<undefined>, WithConfig<Config> {
  onClick: VoidFunction;
}

export const Button: React.FC<Props> = ({ label, onClick, config }) => {
  return (
    <>
      {label}
      <Control onClick={onClick} icon={config?.icon} reverse={config?.reverse}>
        {config?.text}
      </Control>
    </>
  );
};
