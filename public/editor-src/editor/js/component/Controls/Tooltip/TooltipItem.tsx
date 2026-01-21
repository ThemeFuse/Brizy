import classnames from "classnames";
import React, { MouseEvent, ReactElement, ReactNode } from "react";

type TooltipItemProps = {
  children: ReactNode;
  className?: string;
  attr?: Record<string, string>;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

export const TooltipItem = (props: TooltipItemProps): ReactElement => {
  const { className: _className, children, onClick, attr, disabled } = props;
  const className = classnames(
    "brz-ed-tooltip__item",
    { "brz-ed-tooltip__item--disabled": disabled },
    _className
  );

  return (
    <div className={className} onClick={onClick} {...attr}>
      {children}
    </div>
  );
};
