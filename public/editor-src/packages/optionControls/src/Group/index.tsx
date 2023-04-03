import classNames from "classnames";
import React, { FC } from "react";

export interface Props {
  className?: string;
}

export const Group: FC<Props> = ({ className, children }) => (
  <div className={classNames("brz-ed-control__group", className)}>
    {children}
  </div>
);
