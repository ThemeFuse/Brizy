import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input as Control } from "visual/component/Controls/Input";
import { String } from "visual/utils/string/specs";
import * as Option from "visual/component/Options/Type";
import { debouncedEffect } from "visual/component/hooks";
import { Component, Model } from "./Type";

export const InputText: Component = ({
  className,
  onChange,
  value: { value },
  config = {},
  placeholder,
  label
}) => {
  const [_value, setValue] = useState(value);
  const lastUpdate = useRef(_value);

  useEffect(() => {
    if (lastUpdate.current !== value) {
      lastUpdate.current = value;
      setValue(value);
    }
  }, [value]);

  debouncedEffect(
    () => {
      if (lastUpdate.current !== _value) {
        lastUpdate.current = _value;
        onChange({ value: _value });
      }
    },
    1000,
    [onChange, _value]
  );

  const handleBlur = useCallback(() => {
    if (lastUpdate.current !== _value) {
      lastUpdate.current = _value;
      onChange({ value: _value });
    }
  }, [onChange, _value]);

  return (
    <>
      {label}
      <Control
        className={className}
        onChange={setValue}
        onBlur={handleBlur}
        value={_value}
        size={config.size ?? "auto"}
        placeholder={placeholder}
      />
    </>
  );
};

const getModel: Option.GetModel<Model> = get => ({
  value: String.read(get("value"))
});

const getElementModel: Option.GetElementModel<Model> = (values, get) => {
  return {
    [get("value")]: values.value
  };
};

InputText.defaultValue = {
  value: ""
};

InputText.getModel = getModel;

InputText.getElementModel = getElementModel;
