import React, { FC, useCallback } from "react";
import { InputWithDebounce as Control } from "visual/component/Controls/Input";
import { Props } from "./types";
import { formatLink } from "./utils";

export const LinkExternal: FC<Props> = ({
  onChange,
  value: { value },
  placeholder,
  label,
  className
}) => {
  const handleChange = useCallback(
    (v: string) => onChange({ value: formatLink(v) }),
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
