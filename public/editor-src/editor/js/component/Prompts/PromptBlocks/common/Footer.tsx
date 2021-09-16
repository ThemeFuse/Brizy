import React, { FC } from "react";
import classnames from "classnames";

export interface Props {
  className?: string;
  alignY?: "top" | "middle" | "bottom";
  alignX?: "left" | "middle" | "right";
}

export const Footer: FC<Props> = props => {
  const {
    alignX = "top",
    alignY = "left",
    className: _className,
    children
  } = props;
  const className = classnames("brz-ed-popup-two__footer", _className, {
    [`brz-ed-popup-two__footer--x-${alignX}`]: alignX,
    [`brz-ed-popup-two__footer--y-${alignY}`]: alignY
  });

  return <div className={className}>{children}</div>;
};
