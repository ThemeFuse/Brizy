import React, { ReactElement } from "react";
import { Props } from "../types";

export const ShopifyPriceStyle3 = ({
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
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(0 3)" fill="currentColor" fillRule="nonzero">
          <path d="M8.558 2L4.516 8H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7.558zM15 2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H7.174l4.201-6H15z" />
          <path d="M10.931 0H12L5.06 10H4z" />
        </g>
      </g>
    </g>
  </svg>
);
