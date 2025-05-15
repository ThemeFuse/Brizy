import classnames from "classnames";
import React, { ReactElement } from "react";

export interface Props {
  message: string;
  type?: "error" | "success";
  className?: string;
}

export const Alert = (props: Props): ReactElement => {
  const { message, type = "success", className: _className } = props;
  const className = classnames("brz-ed-alert", _className, {
    [`brz-ed-alert-${type}`]: type
  });

  return (
    <div className={className}>
      <span className="brz-span">{message}</span>
    </div>
  );
};
