import classnames from "classnames";
import React, { Attributes, CSSProperties, ReactNode, forwardRef } from "react";
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
  children?: ReactNode;
}

export const SubmitButton = forwardRef<HTMLDivElement, SubmitButtonProps>(
  ({ className, style, attributes, children }, ref) => (
    <div className={className} style={style} {...attributes} ref={ref}>
      {children}
    </div>
  )
);

interface MSButtonsProps {
  className?: string;
}

export const MSButtons: FCC<MSButtonsProps> = ({ className, children }) => (
  <div className={classnames("brz-form-ms-buttons", className)}>{children}</div>
);
