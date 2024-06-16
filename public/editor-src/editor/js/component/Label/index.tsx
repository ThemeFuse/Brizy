import classNames from "classnames";
import React from "react";
import { FCC } from "visual/utils/react/types";

type Props = {
  className?: string;
  title?: string;
};

export const Label: FCC<Props> = ({ className, title, children }) => {
  const _className = classNames("brz-ed-component__label", className);
  return (
    <div className={_className} title={title}>
      {children}
    </div>
  );
};
