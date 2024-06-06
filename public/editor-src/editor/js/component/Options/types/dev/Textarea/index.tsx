import React, { ReactElement, useState } from "react";
import { Textarea as Control } from "visual/component/Controls/Textarea";
import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { useDebouncedEffect } from "visual/component/hooks";
import {
  WithClassName,
  WithConfig,
  WithPlaceholder,
  WithSize
} from "visual/utils/options/attributes";

export type Config = WithSize & {
  lines?: number;
};
export type Model = SimpleValue<string>;
export type Props = OptionProps<Model> &
  WithConfig<Config> &
  WithClassName &
  WithPlaceholder;

export const Textarea = ({
  className,
  onChange,
  value: { value },
  config = {},
  placeholder,
  label
}: Props): ReactElement => {
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
