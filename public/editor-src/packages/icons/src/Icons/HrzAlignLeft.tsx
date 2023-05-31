import React, { ReactElement } from "react";
import { Props } from "../types";

export const HrzAlignLeft = ({
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
        d="M1,0 L15,0 C15.5522847,-1.01453063e-16 16,0.44771525 16,1 L16,15 C16,15.5522847 15.5522847,16 15,16 L1,16 C0.44771525,16 6.76353751e-17,15.5522847 0,15 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z M5,4 C5,3.44771525 4.55228475,3 4,3 C3.44771525,3 3,3.44771525 3,4 L3,12 C3,12.5522847 3.44771525,13 4,13 C4.55228475,13 5,12.5522847 5,12 L5,4 Z"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);
