import React, { JSX } from "react";
import { Circle as Props } from "./types";
import { FCC } from "visual/utils/react/types";

export const Circle: FCC<Props> = ({
  hint,
  classname,
  children,
  onClick
}): JSX.Element => (
  <div title={hint} className={classname} onClick={onClick}>
    {children}
  </div>
);
