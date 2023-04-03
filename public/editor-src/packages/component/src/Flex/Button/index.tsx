import classnames from "classnames";
import React, { ReactElement } from "react";
import { Props } from "./types";

export const Button = ({
  className,
  children,
  onClick
}: Props): ReactElement => {
  return (
    <button
      className={classnames("brz-package__button", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
