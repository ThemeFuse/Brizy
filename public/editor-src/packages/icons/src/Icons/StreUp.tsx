import React, { ReactElement } from "react";
import { Props } from "../types";

export const StreUp = ({ className, onClick, style }: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
  >
    <g>
      <g>
        <path
          fill="currentColor"
          d="M15.108,12.41L8,6.317L0.892,12.41l-1.302-1.519l7.759-6.65c0.375-0.322,0.927-0.322,1.302,0l7.759,6.65 L15.108,12.41z"
        ></path>
      </g>
    </g>
  </svg>
);
