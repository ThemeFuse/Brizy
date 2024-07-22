import React, { ReactElement } from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import { WithConfig } from "visual/utils/options/attributes";
import { IconSetter as IconSetterControl } from "visual/component/Controls/IconSetter";
import { Value } from "./types/Value";
import { Config } from "./types/Config";

export interface Props extends OptionProps<Value>, WithConfig<Config> {}

export const IconSetter = ({
  config,
  onChange,
  value,
  label
}: Props): ReactElement => {
  return (
    <>
      {label}
      <IconSetterControl
        value={value}
        onChange={onChange}
        canDelete={config?.canDelete ?? false}
      />
    </>
  );
};
