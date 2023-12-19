import classNames from "classnames";
import React, { FC } from "react";

type Props = {
  className?: string;
  title?: string;
};

export const Label: FC<Props> = ({ className, title, children }) => {
  const _className = classNames("brz-ed-component__label", className);
  return (
    <div className={_className} title={title}>
      {children}
    </div>
  );
};
