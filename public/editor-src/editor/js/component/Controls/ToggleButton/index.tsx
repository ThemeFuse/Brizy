import classNames from "classnames";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Props } from "./types";
import { getButtonClassName } from "./utils";
import { FCC } from "visual/utils/react/types";

export const ToggleButton: FCC<Props> = ({
  value,
  label,
  type = "default",
  reverseTheme = true,
  align = "center",
  className,
  children,
  icon,
  title,
  onClick
}): JSX.Element => {
  const _buttonStyle = getButtonClassName({ type, value, reverseTheme });

  const _className = classNames(
    _buttonStyle,
    "brz-ed-control__button",
    `brz-ed-control__button-${align}`,
    className
  );

  return children || icon ? (
    <>
      {label || null}
      <div className={_className} onClick={onClick} title={title}>
        {icon && <EditorIcon icon={icon} />}
        {children && <span className="brz-ed-control__label">{children}</span>}
      </div>
    </>
  ) : (
    <></>
  );
};
