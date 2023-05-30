import React, { ReactElement } from "react";
import { Props } from "../types";

export const HrzAlignRight = ({
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
        d="M1,0 L15,0 C15.5522847,-1.01453063e-16 16,0.44771525 16,1 L16,15 C16,15.5522847 15.5522847,16 15,16 L1,16 C0.44771525,16 6.76353751e-17,15.5522847 0,15 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z M13,4 C13,3.44771525 12.5522847,3 12,3 C11.4477153,3 11,3.44771525 11,4 L11,12 C11,12.5522847 11.4477153,13 12,13 C12.5522847,13 13,12.5522847 13,12 L13,4 Z"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);
