import React, { FC, useEffect, useRef, useState } from "react";
import { CodeMirror as Control } from "visual/component/Controls/CodeMirror";
import * as Option from "visual/component/Options/Type";
import { useDebouncedEffect } from "visual/component/hooks";
import {
  WithClassName,
  WithConfig,
  WithPlaceholder,
  WithSize
} from "visual/utils/options/attributes";

export type Config = WithSize & {
  language: "html" | "css" | "markdown" | "xml";
};

type Model = Option.SimpleValue<string>;
export type Props = Option.Props<Model> &
  WithConfig<Config> &
  WithClassName &
  WithPlaceholder;

export const CodeMirror: FC<Props> = ({
  className,
  onChange,
  value: { value },
  config,
  placeholder,
  label
}) => {
  const [_value, setValue] = useState(value);
  const ref = useRef<string>();

  useDebouncedEffect(
    () => {
      if (value !== _value) {
        onChange({ value: _value });
        ref.current = _value;
      }
    },
    1000,
    [_value]
  );

  useEffect(() => {
    if (value !== ref.current) {
      setValue(value);
    }
  }, [value]);

  return (
    <>
      {label}
      <Control
        className={className}
        onChange={setValue}
        value={_value}
        language={config?.language ?? "css"}
        placeholder={placeholder}
        size={config?.size ?? "medium"}
      />
    </>
  );
};
