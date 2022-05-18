import React, { FC, useState } from "react";
import { Textarea as Control } from "visual/component/Controls/Textarea";
import { String } from "visual/utils/string/specs";
import * as Option from "visual/component/Options/Type";
import { useDebouncedEffect } from "visual/component/hooks";
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
export type Props = Option.Props<Model> &
  WithConfig<Config> &
  WithClassName &
  WithPlaceholder;

export const Textarea: FC<Props> & Option.OptionType<Model> = ({
  className,
  onChange,
  value: { value },
  config = {},
  placeholder,
  label
}) => {
  const [_value, setValue] = useState(value);

  useDebouncedEffect(
    () => {
      if (value !== _value) {
        onChange({ value: _value });
      }
    },
    1000,
    [_value]
  );

  return (
    <>
      {label}
      <Control
        className={className}
        onChange={setValue}
        value={_value}
        size={config.size ?? "auto"}
        placeholder={placeholder}
        rows={config.lines}
      />
    </>
  );
};

const getModel: Option.FromElementModel<Model> = get => ({
  value: String.read(get("value"))
});

const getElementModel: Option.ToElementModel<Model> = values => {
  return {
    value: values.value
  };
};

Textarea.fromElementModel = getModel;

Textarea.toElementModel = getElementModel;

Textarea.defaultValue = {
  value: ""
};
