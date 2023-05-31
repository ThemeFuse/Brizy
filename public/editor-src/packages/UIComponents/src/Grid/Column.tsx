import classNames from "classnames";
import React, { FC } from "react";
import { ColumnProps } from "./types";

const alignMap = {
  start: "brz-ed-control__grid__column--align-start",
  center: "brz-ed-control__grid__column--align-center",
  end: "brz-ed-control__grid__column--align-end"
};

export const Column: FC<ColumnProps> = ({ className, children, align }) => {
  const _className = classNames(
    "brz-ed-control__grid__column",
    className,
    alignMap[align]
  );

  return <div className={_className}>{children}</div>;
};
