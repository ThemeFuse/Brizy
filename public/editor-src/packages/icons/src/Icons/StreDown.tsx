import React, { ReactElement } from "react";
import { Props } from "../types";

export const StreDown = ({
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
    <g>
      <g>
        <path
          fill="currentColor"
          d="M8,12c-0.232,0-0.463-0.08-0.651-0.241l-7.759-6.65L0.892,3.59L8,9.683l7.108-6.093l1.302,1.519l-7.759,6.65 C8.463,11.92,8.232,12,8,12z"
        ></path>
      </g>
    </g>
  </svg>
);
