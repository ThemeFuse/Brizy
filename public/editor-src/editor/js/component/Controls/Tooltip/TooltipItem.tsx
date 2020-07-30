import React, { ReactElement, ReactNode, MouseEvent } from "react";
import classnames from "classnames";

type TooltipItemProps = {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

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
