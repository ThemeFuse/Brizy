import classNames from "classnames";
import React, { FC, ReactElement } from "react";
import { EditorIcon } from "..";
import { Props } from "./types";

export const Button: FC<Props> = ({
  className,
  onClick,
  icon,
  children,
  reverse,
  align = "center",
  reverseTheme = false,
  title
}): ReactElement | null => {
  const _className = classNames(
    "brz-ed-control__button",
    `brz-ed-control__button-${align}`,
    className,
    {
      reverse: !!reverse,
      reverseTheme: !!reverseTheme
    }
  );

  return children || icon ? (
    <div className={_className} onClick={onClick} title={title}>
      {icon && <EditorIcon icon={icon} />}
      {children && <span className="brz-ed-control__label">{children}</span>}
    </div>
  ) : null;
};
