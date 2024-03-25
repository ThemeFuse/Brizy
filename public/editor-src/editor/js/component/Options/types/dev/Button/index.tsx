import React, { ReactElement } from "react";
import { Button as Control } from "visual/component/Controls/Button";
import * as Option from "visual/component/Options/Type";
import { WithConfig } from "visual/utils/options/attributes";

export interface Config {
  icon: string;
  text?: string;
  reverse?: boolean;
  reverseTheme?: boolean;
  title?: string;
  value?: boolean;
}

export interface Props extends Option.Props<undefined>, WithConfig<Config> {
  onClick: VoidFunction;
}

export const Button = ({ label, onClick, config }: Props): ReactElement => {
  return (
    <>
      {label}
      <Control
        onClick={onClick}
        icon={config?.icon}
        reverse={config?.reverse}
        reverseTheme={config?.reverseTheme}
        title={config?.title}
      >
        {config?.text}
      </Control>
    </>
  );
};
