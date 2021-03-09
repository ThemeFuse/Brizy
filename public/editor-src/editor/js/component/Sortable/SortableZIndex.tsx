import React, { ReactElement } from "react";
import { Dictionary } from "visual/types/utils";

export interface Props {
  zIndex: number;
  children: ReactElement | ((attr: Dictionary<number>) => ReactElement);
}

export const SortableZIndex = (props: Props): ReactElement => {
  const { zIndex = 0, children } = props;
  const dataProps: Dictionary<number> = IS_PREVIEW
    ? {}
    : {
        "data-sortable-zindex": zIndex
      };

  return typeof children === "function"
    ? children(dataProps)
    : React.cloneElement(children, dataProps);
};
