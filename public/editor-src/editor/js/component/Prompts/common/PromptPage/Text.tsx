import classnames from "classnames";
import React, { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  children: string;
}

export const Text = ({ className, style, children }: Props): JSX.Element => (
  <p className={classnames("brz-p", className)} style={style}>
    {children}
  </p>
);
