import classNames from "classnames";
import React from "react";

export interface Props {
  status?: "publish" | "draft" | "pending";
  className?: string;
}

export const Badge = ({ status, className }: Props): JSX.Element => {
  const _className = classNames("brz-badge", className, {
    [`brz-badge__${status}`]: status
  });

  return <div title={status} className={_className} />;
};
