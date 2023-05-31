import React, { ReactElement } from "react";
import { Props } from "../types";

export const ShopifyPriceStyle2 = ({
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
        <g transform="translate(0 5)" fill="currentColor" fillRule="nonzero">
          <rect x="0" y="0" width="16" height="6" rx="1" />
        </g>
      </g>
    </g>
  </svg>
);
