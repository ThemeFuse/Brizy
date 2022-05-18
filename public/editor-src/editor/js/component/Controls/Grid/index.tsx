import React, { CSSProperties, ReactElement } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import { Props as ColProps } from "./Column";

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
      .map(item => {
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
