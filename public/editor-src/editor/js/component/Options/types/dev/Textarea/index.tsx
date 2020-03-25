import React, { FC, useState } from "react";
import { Textarea as Control } from "visual/component/Controls/Textarea";
import { String } from "visual/utils/string/specs";
import * as Option from "visual/component/Options/Type";
import { debouncedEffect } from "visual/component/hooks";
import {
  WithClassName,
  WithConfig,
  WithPlaceholder,
  WithSize
} from "visual/utils/options/attributes";

export type Config = WithSize & {
  lines: number;
};
export type Model = Option.SimpleValue<string>;
export type Props = Option.Props<Model, Model> &
  WithConfig<Config> &
  WithClassName &
  WithPlaceholder;

export const Textarea: FC<Props> & Option.OptionType<Model> = ({
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
      size={config.size ?? "auto"}
      placeholder={placeholder}
      rows={config.lines}
    />
  );
};

const getModel: Option.GetModel<Model> = get => ({
  value: String.read(get("value")) || ""
});

Textarea.getModel = getModel;
