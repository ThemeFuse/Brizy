import React, { ReactElement } from "react";
import { Props } from "../types";

export const MediaImage = ({
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
    <g stroke="none" fill="none" strokeWidth="1" fillRule="evenodd">
      <path
        d="M5.2,2 C6.04,2 6.6,2.6 6.6,3.5 C6.6,4.4 6.04,5 5.2,5 C4.36,5 3.8,4.4 3.8,3.5 C3.8,2.6 4.36,2 5.2,2 Z M1,14 L3.8,8 L6.6,11 L10.8,5 L15,14 L1,14 Z"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);
