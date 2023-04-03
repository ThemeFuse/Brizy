import React, { ReactElement } from "react";
import { Props } from "../types";

export const CheckCircle = ({
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
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M8,0 C3.6,0 0,3.6 0,8 C0,12.4 3.6,16 8,16 C12.4,16 16,12.4 16,8 C16,3.6 12.4,0 8,0 Z M7,11.4 L3.6,8 L5,6.6 L7,8.6 L11,4.6 L12.4,6 L7,11.4 Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </g>
  </svg>
);
