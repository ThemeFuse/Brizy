import classnames from "classnames";
import React, { Attributes, CSSProperties } from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export const Button: FCC<Props> = ({ className, style, children }) => (
  <span className={className} style={style}>
    {children}
  </span>
);

interface SubmitButtonProps {
  className?: string;
  style?: CSSProperties;
  attributes?: Attributes;
}

export const SubmitButton: FCC<SubmitButtonProps> = ({
  className,
  style,
  attributes,
  children
}) => (
  <div className={className} style={style} {...attributes}>
    {children}
  </div>
);

interface MSButtonsProps {
  className?: string;
}

export const MSButtons: FCC<MSButtonsProps> = ({ className, children }) => (
  <div className={classnames("brz-form-ms-buttons", className)}>{children}</div>
);
