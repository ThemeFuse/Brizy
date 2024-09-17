import classNames from "classnames";
import React from "react";
import { WithClassName } from "visual/types/attributes";
import { FCC } from "visual/utils/react/types";

export interface Props extends WithClassName {
  align: "start" | "center" | "end";
}

const alignMap = {
  start: "brz-ed-control__grid__column--align-start",
  center: "brz-ed-control__grid__column--align-center",
  end: "brz-ed-control__grid__column--align-end"
};

export const Column: FCC<Props> = ({ className, children, align }) => (
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
