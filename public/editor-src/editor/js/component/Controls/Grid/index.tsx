import classNames from "classnames";
import React, { type CSSProperties, type ReactElement } from "react";
import type { WithClassName } from "visual/types/attributes";
import type { Props as ColProps } from "./Column";

interface Props extends WithClassName {
  grid: Array<"auto" | number>;
  separator: boolean;
  children: ReactElement<ColProps>[];
}

export const Grid = ({
  className,
  children,
  grid,
  separator
}: Props): ReactElement => {
  const style: CSSProperties = {
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

  return (
    <div
      className={classNames("brz-ed-control__grid", className, {
        "brz-ed-control__grid--separator": separator
      })}
      style={style}
    >
      {children}
    </div>
  );
};
