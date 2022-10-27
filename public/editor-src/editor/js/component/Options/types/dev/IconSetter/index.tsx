import React from "react";
import { IconSetter as IconSetterControl } from "visual/component/Controls/IconSetter";
import * as Option from "visual/component/Options/Type";
import { WithConfig } from "visual/utils/options/attributes";
import { Config } from "./types/Config";
import { fromElementModel, toElementModel, Value } from "./types/Value";

export type Props = Option.Props<Value> & WithConfig<Config>;

export const IconSetter: React.FC<Props> & Option.OptionType<Value> = ({
  config,
  onChange,
  value,
  label
}) => {
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

IconSetter.fromElementModel = fromElementModel;
IconSetter.toElementModel = toElementModel;
IconSetter.defaultValue = undefined;
