import classnames from "classnames";
import React, { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  children: string;
}

export const Text: React.FC<Props> = ({ className, style, children }) => (
  <p className={classnames("brz-p", className)} style={style}>
    {children}
  </p>
);
