import React, { ReactElement } from "react";
import { Props } from "../types";

export const ShopifyPriceStyle1 = ({
  className,
  onClick,
  style
}: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    viewBox="0 0 16 16"
  >
    <g fill="currentColor">
      <g
        transform="translate(0 3)"
        fill="currentColor"
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
      >
        <rect x="0" y="2" width="7" height="6" rx="1" />
        <path d="M16 3v4a1 1 0 0 1-1 1h-3.314l3.932-5.786A.998.998 0 0 1 16 3zm-3.008-1L9 8c-.336 0-1-.16-1-1V3a1 1 0 0 1 1-1h3.992z" />
        <path d="M15.208 0L16 .467 8.753 11 8 10.407z" />
      </g>
    </g>
  </svg>
);
