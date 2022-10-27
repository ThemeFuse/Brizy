import classNames from "classnames";
import React from "react";

export type Props = {
  className?: string;
  display?: "inline" | "block";
  title?: string;
};

export const OptionWrapper: React.FC<Props> = ({
  children,
  className,
  display = "inline",
  title
}) => {
  const _className = classNames(
    "brz-ed-option-wrapper",
    `brz-ed-option__${display}`,
    className
  );

  return (
    <div className={_className} title={title}>
      {children}
    </div>
  );
};
