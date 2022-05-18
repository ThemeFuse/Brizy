import React, { ReactElement } from "react";
import classNames from "classnames";

export interface Props {
  status: "publish" | "draft" | "pending";
}

export const Badge = ({ status }: Props): ReactElement => {
  const className = classNames("brz-badge", {
    [`brz-badge__${status}`]: status
  });

  return <div title={status} className={className} />;
};
