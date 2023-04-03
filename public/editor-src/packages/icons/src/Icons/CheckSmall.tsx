import React, { ReactElement } from "react";
import { Props } from "../types";

export const CheckSmall = ({
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
    <g fillRule="nonzero" fill="currentColor" stroke="none" strokeWidth="1">
      <polygon
        fillRule="nonzero"
        fill="currentColor"
        points="6.50836363 12.992 1.87199996 7.99199999 3.78109089 5.93317645 6.50836363 8.87435295 11.9629091 2.99199996 13.872 5.0508235"
      />
    </g>
  </svg>
);
