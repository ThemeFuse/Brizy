import React, { ReactElement } from "react";
import { Props } from "../types";

export const MinistryBrandsEventCalendar = ({
  className,
  onClick,
  style
}: Props): ReactElement => {
  return (
    <svg
      className={className}
      style={style}
      onClick={onClick}
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <g stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
        <path
          d="M16,3.5 L16,14.5 C16,15.3284505 15.2325149,16 14.2857143,16 L1.71428571,16 C0.767485119,16 0,15.3284505 0,14.5 L0,3.5 C0,2.67154948 0.767485119,2 1.71428571,2 L3.42857143,2 L3.42857143,0.375 C3.42857143,0.16796875 3.62053571,0 3.85714286,0 L5.28571429,0 C5.52232143,0 5.71428571,0.16796875 5.71428571,0.375 L5.71428571,2 L10.2857143,2 L10.2857143,0.375 C10.2857143,0.16796875 10.4776786,0 10.7142857,0 L12.1428571,0 C12.3794643,0 12.5714286,0.16796875 12.5714286,0.375 L12.5714286,2 L14.2857143,2 C15.2325149,2 16,2.67154948 16,3.5 Z M14,13.8223684 L14,5 L2,5 L2,13.8223684 C2,13.9204359 2.09161932,14 2.20454545,14 L13.7954545,14 C13.9083807,14 14,13.9204359 14,13.8223684 Z"
          fill="currentColor"
          fillRule="nonzero"
        ></path>
      </g>
    </svg>
  );
};
