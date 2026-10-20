import React, { type ReactElement } from "react";
import { IconSetter as IconSetterControl } from "visual/component/Controls/IconSetter";
import type { Props as OptionProps } from "visual/component/Options/Type";
import type { WithConfig } from "visual/types/attributes";
import type { Config } from "./types/Config";
import type { Value } from "./types/Value";

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
