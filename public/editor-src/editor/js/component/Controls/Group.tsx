import React from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import { FCC } from "visual/utils/react/types";

type Props = WithClassName;

export const Group: FCC<Props> = ({ className, children }) => (
  <div className={classNames("brz-ed-control__group", className)}>
    {children}
  </div>
);
