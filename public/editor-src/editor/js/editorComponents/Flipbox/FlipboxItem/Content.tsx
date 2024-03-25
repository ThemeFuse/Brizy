import classnames from "classnames";
import React, { forwardRef } from "react";
import { ContentProps as Props } from "../types";

export const Content = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { type, isActive, animationClassName, children } = props;

  const className = classnames("brz-flipbox-item", {
    [`brz-flipbox-item-${type}`]: type,
    "brz-flipbox-item--active": isActive,
    [`${animationClassName}`]: type === "back"
  });

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
});
