import React, { ReactElement } from "react";
import { Props } from "../types";

export const CircleRemove = ({
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
          d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M11.5,10.1l-1.4,1.4L8,9.4l-2.1,2.1l-1.4-1.4L6.6,8 L4.5,5.9l1.4-1.4L8,6.6l2.1-2.1l1.4,1.4L9.4,8L11.5,10.1z"
        ></path>
      </g>
    </g>
  </svg>
);
