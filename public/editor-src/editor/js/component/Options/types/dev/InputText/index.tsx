import React, { useCallback } from "react";
import { InputWithDebounce as Control } from "visual/component/Controls/Input";
import { Component } from "./Type";

export const InputText: Component = ({
  className,
  onChange,
  value: { value },
  placeholder,
  label
}) => {
  const handleChange = useCallback(
    (v: string) => onChange({ value: v }),
    [onChange]
  );

  return (
    <>
      {label}
      <Control
        className={className}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
      />
    </>
  );
};
