import React, { ReactElement } from "react";
import { Props } from "../types";

export const Duplicate = ({
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
    <g>
      <g
        transform="matrix(-1 0 0 1 14 0)"
        fillRule="nonzero"
        fill="currentColor"
        stroke="none"
        strokeWidth="1"
      >
        <path d="M9 4H1c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1z" />
        <path d="M13 0H3v2h9v11h2V1c0-.6-.4-1-1-1z" />
      </g>
    </g>
  </svg>
);
