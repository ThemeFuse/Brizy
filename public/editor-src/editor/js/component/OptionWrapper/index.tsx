import React from "react";
import classNames from "classnames";

export type Props = {
  className?: string;
  display?: "inline" | "block";
};

export const OptionWrapper: React.FC<Props> = ({
  children,
  className,
  display = "inline"
}) => {
  const _className = classNames(
    "brz-ed-option-wrapper",
    `brz-ed-option__${display}`,
    className
  );

  return <div className={_className}>{children}</div>;
};
