import React, { ReactElement } from "react";
import { Props } from "../types";

export const Heart = ({ className, onClick, style }: Props): ReactElement => (
  <svg
    className={className}
    style={style}
    onClick={onClick}
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <g fill="currentColor" fillRule="nonzero" transform="translate(-86 -419)">
      <g transform="translate(47)">
        <g transform="translate(0 78)">
          <g transform="translate(0 328)">
            <g transform="translate(39 11)">
              <g transform="translate(0 1)">
                <path d="M14.682 2.318a4.5 4.5 0 00-6.364 0c-.121.121-.214.259-.318.389-.104-.13-.197-.268-.318-.389a4.5 4.5 0 00-6.364 6.364L8 15l6.682-6.318a4.5 4.5 0 000-6.364z"></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
