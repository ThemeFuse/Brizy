import classnames from "classnames";
import React, { ReactElement } from "react";
import { TooltipItemProps } from "../types";

export const TooltipItem: React.FC<TooltipItemProps> = (
  props: TooltipItemProps
): ReactElement => {
  const { className: _className, children, onClick } = props;
  const className = classnames("brz-ed-tooltip__item", _className);

  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};
