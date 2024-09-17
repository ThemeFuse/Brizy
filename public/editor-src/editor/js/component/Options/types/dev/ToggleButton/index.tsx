import React, { useCallback, useMemo } from "react";
import { ToggleButton as Control } from "visual/component/Controls/ToggleButton";
import { Props } from "./types";
import { Toggle } from "visual/utils/options/utils/Type";

export const ToggleButton = ({
  value: { value },
  label,
  className,
  onChange,
  children,
  align = "center",
  config
}: Props): JSX.Element | null => {
  const { icon, title, reverseTheme, type, on, off } = config;

  const { _on, _off } = useMemo(
    () => ({
      _on: on ?? Toggle.ON,
      _off: off ?? Toggle.OFF
    }),
    [on, off]
  );

  const handleClick = useCallback(() => {
    const v = value === _on ? _off : _on;
    onChange({ value: v });
  }, [_off, _on, onChange, value]);

  return (
    <Control
      value={value === _on}
      icon={icon}
      title={title}
      label={label}
      onClick={handleClick}
      className={className}
      type={type}
      align={align}
      reverseTheme={reverseTheme}
    >
      {children}
    </Control>
  );
};
