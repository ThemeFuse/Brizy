import React, { FC } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";

type Props = WithClassName;

export const Group: FC<Props> = ({ className, children }) => (
  <div className={classNames("brz-ed-control__group", className)}>
    {children}
  </div>
);
