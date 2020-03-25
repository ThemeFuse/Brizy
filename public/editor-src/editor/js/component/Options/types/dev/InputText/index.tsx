import React, { useState } from "react";
import { Input as Control } from "visual/component/Controls/Input";
import { String } from "visual/utils/string/specs";
import { GetModel } from "visual/component/Options/Type";
import { debouncedEffect } from "visual/component/hooks";
import { Component, Model } from "./Type";

export const InputText: Component = ({
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
      size={config.size ?? "large"}
      placeholder={placeholder}
    />
  );
};

const getModel: GetModel<Model> = get => ({
  value: String.read(get("value")) || ""
});

InputText.getModel = getModel;
