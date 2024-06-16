import classNames from "classnames";
import React, { ReactElement, ReactNode } from "react";

export interface Props {
  type?: "page" | "story" | "popup";
  attr?: React.Attributes;
  className?: string;
  children: ReactNode;
}

export const Root = (props: Props): ReactElement => {
  const { type, children, attr, className: _className } = props;
  const className = classNames(
    "brz-root__container brz-reset-all",
    _className,
    { [`brz-root__container-${type}`]: type }
  );
  return (
    <div {...attr} className={className}>
      {children}
    </div>
  );
};
