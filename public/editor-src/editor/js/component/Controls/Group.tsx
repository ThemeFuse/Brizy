import classNames from "classnames";
import React from "react";
import { WithClassName } from "visual/types/attributes";
import { FCC } from "visual/utils/react/types";

type Props = WithClassName;

export const Group: FCC<Props> = ({ className, children }) => (
  <div className={classNames("brz-ed-control__group", className)}>
    {children}
  </div>
);
