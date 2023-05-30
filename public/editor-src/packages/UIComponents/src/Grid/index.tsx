import classNames from "classnames";
import React, { ReactElement } from "react";
import { GridProps } from "./types";

export const Grid = ({
  className,
  children,
  grid,
  showSeparator
}: GridProps): ReactElement => {
  const style = {
    gridTemplateColumns: grid
      .map((item) => {
        switch (item) {
          case "auto":
            return item;
          default:
            return `${item}fr`;
        }
      })
      .join(" ")
  };

  const _className = classNames("brz-ed-control__grid", className, {
    "brz-ed-control__grid--separator": showSeparator
  });

  return (
    <div className={_className} style={style}>
      {children}
    </div>
  );
};
