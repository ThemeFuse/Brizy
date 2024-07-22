import classNames from "classnames";
import React, { ReactElement, useCallback } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Props } from "./types";

export const ToggleButton = ({
  value: _value,
  className,
  onChange,
  children,
  align = "center",
  config
}: Props): ReactElement | null => {
  const { icon, title, reverseTheme } = config;
  const { value } = _value;

  const handleClick = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  const _className = classNames(
    {
      "brz-ed-toolbar--active": value,
      reverseTheme: reverseTheme
    },
    "brz-ed-control__button",
    `brz-ed-control__button-${align}`,
    className
  );

  return children || icon ? (
    <div className={_className} onClick={handleClick} title={title}>
      {icon && <EditorIcon icon={icon} />}
      {children && <span className={"brz-ed-control__label"}>{children}</span>}
    </div>
  ) : null;
};
