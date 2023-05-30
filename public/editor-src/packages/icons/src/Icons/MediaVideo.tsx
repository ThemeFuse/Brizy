import React, { ReactElement } from "react";
import { Props } from "../types";

export const MediaVideo = ({
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
        d="M11,6.5 C11,6.01538462 10.65,5.69230769 10.125,5.69230769 L8,5.69230769 L8,2.80769231 C8,2.32307692 7.65,2 7.125,2 L3,2 L3,3.84615385 L6,3.84615385 L6,5.69230769 L1.875,5.69230769 C1.35,5.69230769 1,6.01538462 1,6.5 L1,13.1923077 C1,13.6769231 1.35,14 1.875,14 L10.125,14 C10.65,14 11,13.6769231 11,13.1923077 L11,11.5769231 L15,13.1923077 L15,6.5 L11,8.11538462 L11,6.5 Z"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);
