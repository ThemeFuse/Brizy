import React, { ReactElement } from "react";
import { RenderType, isView } from "visual/providers/RenderProvider";
import { Dictionary } from "visual/types/utils";

export interface Props {
  zIndex: number;
  children: ReactElement | ((attr: Dictionary<number>) => ReactElement);
  renderContext: RenderType;
}

export const SortableZIndex = (props: Props): ReactElement => {
  const { zIndex = 0, children, renderContext } = props;
  const dataProps: Dictionary<number> = isView(renderContext)
    ? {}
    : {
        "data-brz-sortable-zindex": zIndex
      };

  return typeof children === "function"
    ? children(dataProps)
    : React.cloneElement(children, dataProps);
};
