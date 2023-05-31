import React, { ReactElement } from "react";
import { Props } from "../types";

export const Spinner = ({ className, onClick, style }: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <g>
      <g>
        <g>
          <path
            style={{ opacity: "0.4" }}
            fill="currentColor"
            className="cls-1"
            d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,2a6,6,0,1,0,6,6A6,6,0,0,0,8,2Z"
          />
          <path
            fill="currentColor"
            d="M16,8H14A6,6,0,0,0,8,2V0A8,8,0,0,1,16,8Z"
          />
        </g>
      </g>
    </g>
  </svg>
);
