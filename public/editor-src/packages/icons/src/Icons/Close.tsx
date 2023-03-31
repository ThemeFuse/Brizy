import React, { ReactElement } from "react";
import { Props } from "../types";

export const Close = ({ className, onClick, style }: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <polygon
        fill="currentColor"
        fillRule="nonzero"
        points="13.3406833 5.55111512e-17 8.76771899 5.11940885 3.58869913 0 0.769230769 2.87439085 6.20794072 8 0.769230769 13.3158649 3.58869913 16 8.76771899 10.8189279 13.9351485 16 16.7692308 13.3158649 11.6597528 8.13088577 16.479809 2.87439085"
      />
    </g>
  </svg>
);
