import React, { ReactElement } from "react";
import { Props } from "../types";

export const ArrowRight = ({
  className,
  onClick,
  style
}: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <g>
      <path
        fill="currentColor"
        d="M9.3 1.3L7.9 2.7 12.2 7H0v2h12.2l-4.3 4.3 1.4 1.4L16 8z"
      />
    </g>
  </svg>
);
