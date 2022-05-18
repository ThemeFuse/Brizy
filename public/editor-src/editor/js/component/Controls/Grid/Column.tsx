import React, { FC } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";

export interface Props extends WithClassName {
  align: "start" | "center" | "end";
}

const alignMap = {
  start: "brz-ed-control__grid__column--align-start",
  center: "brz-ed-control__grid__column--align-center",
  end: "brz-ed-control__grid__column--align-end"
};

export const Column: FC<Props> = ({ className, children, align }) => (
  <div
    className={classNames(
      "brz-ed-control__grid__column",
      className,
      alignMap[align]
    )}
  >
    {children}
  </div>
);
