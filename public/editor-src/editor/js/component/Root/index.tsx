import classNames from "classnames";
import React, { ReactElement, ReactNode } from "react";

export interface Props {
  type?: "page" | "story" | "popup";
  children: ReactNode;
}

export const Root = (props: Props): ReactElement => {
  const { type, children } = props;
  const className = classNames("brz-root__container brz-reset-all", {
    [`brz-root__container-${type}`]: type
  });
  return <div className={className}>{children}</div>;
};
