import React, { ReactElement } from "react";
import { Props } from "../types";

export const TextAlignRight = ({
  className,
  onClick,
  style
}: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
  >
    <g>
      <g fill="currentColor">
        <path fill="currentColor" d="M0 1h16v2H0z"></path>
        <path data-color="color-2" d="M6 5h10v2H6z"></path>
        <path fill="currentColor" d="M0 9h16v2H0z"></path>
        <path data-color="color-2" d="M6 13h10v2H6z"></path>
      </g>
    </g>
  </svg>
);
