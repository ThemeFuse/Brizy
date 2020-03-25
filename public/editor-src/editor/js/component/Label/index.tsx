import React, { FC } from "react";
import classNames from "classnames";

type Props = {
  className?: string;
};

export const Label: FC<Props> = ({ className, children }) => {
  const _className = classNames("brz-ed-component__label", className);
  return <div className={_className}>{children}</div>;
};
