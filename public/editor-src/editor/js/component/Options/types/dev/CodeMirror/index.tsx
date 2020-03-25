import React, { FC, useState } from "react";
import { CodeMirror as Control } from "visual/component/Controls/CodeMirror";
import { String } from "visual/utils/string/specs";
import * as Option from "visual/component/Options/Type";
import { debouncedEffect } from "visual/component/hooks";
import {
  WithClassName,
  WithConfig,
  WithPlaceholder
} from "visual/utils/options/attributes";

export type Config = {
  language: string;
};
export type Model = Option.SimpleValue<string>;
export type Props = Option.Props<Model, Model> &
  WithConfig<Config> &
  WithClassName &
  WithPlaceholder;

export const CodeMirror: FC<Props> & Option.OptionType<Model> = ({
  className,
  onChange,
  value: { value },
  config = {},
  placeholder
}) => {
  const [_value, setValue] = useState(value);

  debouncedEffect(
    () => {
      if (value !== _value) {
        onChange({ value: _value });
      }
    },
    1000,
    [_value]
  );

  return (
    <Control
      className={className}
      onChange={setValue}
      value={_value}
      language={config.language ?? "css"}
      placeholder={placeholder}
    />
  );
};

const getModel: Option.GetModel<Model> = get => ({
  value: String.read(get("value")) || ""
});

CodeMirror.getModel = getModel;
