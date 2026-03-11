import React from "react";

// Intentionally converted to <svg> because if an error is thrown, the Notification component
// can be rendered outside of the Editor providers. EditorIcon requires ConfigProvider and
// ReduxProvider, but these errors can occur without any providers.

interface Props {
  onClick?: VoidFunction;
}

export const SVGInfo = (props: Props) => (
  <svg
    className="brz-icon-svg brz-ed-icon-svg align-[initial]"
    viewBox="0 0 16 16"
    onClick={props.onClick}
  >
    <g fill="currentColor">
      <path
        d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm.8 12H7.2V7.2h1.6V12zm0-6.4H7.2V4h1.6v1.6z"
        fill="currentColor"
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
      />
    </g>
  </svg>
);
