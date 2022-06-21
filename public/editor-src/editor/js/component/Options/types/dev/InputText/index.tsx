import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input as Control } from "visual/component/Controls/Input";
import { String } from "visual/utils/string/specs";
import * as Option from "visual/component/Options/Type";
import { useDebouncedEffect } from "visual/component/hooks";
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

  useDebouncedEffect(
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

const getModel: Option.FromElementModel<Model> = get => ({
  value: String.read(get("value"))
});

const getElementModel: Option.ToElementModel<Model> = values => {
  return {
    value: values.value
  };
};

InputText.defaultValue = {
  value: ""
};

InputText.fromElementModel = getModel;

InputText.toElementModel = getElementModel;
