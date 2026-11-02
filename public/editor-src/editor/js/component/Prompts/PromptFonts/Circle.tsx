import React, { type JSX } from "react";
import type { FCC } from "visual/utils/react/types";
import type { Circle as Props } from "./types";

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
