import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input as Control } from "visual/component/Controls/Input";
import { useDebouncedEffect } from "visual/component/hooks";
import { Component } from "./Type";

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
