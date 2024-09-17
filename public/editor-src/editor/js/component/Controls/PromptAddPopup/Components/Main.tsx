import classnames from "classnames";
import React, { HTMLAttributes } from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  display: "inline" | "block";
  className?: string;
  attr?: HTMLAttributes<HTMLDivElement>;
}

export const Main: FCC<Props> = ({
  display,
  attr,
  children,
  className: _className
}) => {
  const className = classnames(
    "brz-ed-option__prompt-popup",
    `brz-ed-option__${display}`,
    _className,
    attr?.className
  );

  return (
    <div {...attr} className={className}>
      {children}
    </div>
  );
};
