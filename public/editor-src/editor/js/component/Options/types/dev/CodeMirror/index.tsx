import React, { FC, useEffect, useRef, useState } from "react";
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
  language: "html" | "css" | "javascript" | "markdown" | "xml";
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
  const ref = useRef<string>();
  let language: Exclude<Config["language"], "html"> | "htmlmixed";

  debouncedEffect(
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

  if (config?.language === "html") {
    language = "htmlmixed";
  } else {
    language = config?.language ?? "css";
  }

  return (
    <Control
      className={className}
      onChange={setValue}
      value={_value}
      language={language}
      placeholder={placeholder}
    />
  );
};

const getModel: Option.GetModel<Model> = get => ({
  value: String.read(get("value")) || ""
});

CodeMirror.getModel = getModel;
