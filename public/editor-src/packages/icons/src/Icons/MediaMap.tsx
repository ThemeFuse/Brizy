import React, { ReactElement } from "react";
import { Props } from "../types";

export const MediaMap = ({
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
        d="M7,12 C7.55228475,12.5522847 8.44771525,12.5522847 9,12 L9,14 C9,14.5522847 8.55228475,15 8,15 C7.44771525,15 7,14.5522847 7,14 L7,12 Z M8,11 C5.51471863,11 3.5,8.98528137 3.5,6.5 C3.5,4.01471863 5.51471863,2 8,2 C10.4852814,2 12.5,4.01471863 12.5,6.5 C12.5,8.98528137 10.4852814,11 8,11 Z"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);
