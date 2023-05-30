import React, { ReactElement } from "react";
import { Props } from "../types";

export const Delete = ({ className, onClick, style }: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M14,6 L14,14 C14,15.1 13.1,16 12,16 L12,16 L4,16 C2.9,16 2,15.1 2,14 L2,14 L2,6 L14,6 Z M11,0 C11.6,0 12,0.4 12,1 L12,1 L12,3 L16,3 L16,5 L0,5 L0,3 L4,3 L4,1 C4,0.4 4.4,0 5,0 L5,0 Z M10,2 L6,2 L6,3 L10,3 L10,2 Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </g>
  </svg>
);
