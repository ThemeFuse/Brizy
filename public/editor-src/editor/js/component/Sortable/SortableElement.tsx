import React from "react";
import { isView, useRender } from "visual/providers/RenderProvider";
import { makeDataAttr } from "visual/utils/i18n/attribute";

export interface SortableElementDataAttributes {
  "data-brz-sortable-element"?: "true";
  "data-brz-sortable-type"?: string;
  "data-brz-sortable-subtype"?: string;
  "data-brz-sortable-use-handle"?: "true";
}
type FunctionAsAChild = (
  atts: SortableElementDataAttributes
) => React.ReactElement;
type Props = {
  type: string;
  subtype?: string;
  useHandle?: boolean;
  children: React.ReactElement | FunctionAsAChild;
};

export const SortableElement: (props: Props) => React.ReactElement = ({
  children,
  type,
  subtype,
  useHandle
}) => {
  const { renderType } = useRender();
  const sortableUseHandleDataFromAttr = useHandle
    ? makeDataAttr({
        name: "sortable-use-handle",
        value: "true"
      })
    : {};

  const dataProps: SortableElementDataAttributes = isView(renderType)
    ? {}
    : {
        ...makeDataAttr({
          name: "sortable-element",
          value: "true"
        }),
        ...makeDataAttr({ name: "sortable-type", value: type }),
        ...makeDataAttr({ name: "sortable-subtype", value: subtype }),
        ...sortableUseHandleDataFromAttr
      };

  return typeof children === "function"
    ? children(dataProps)
    : React.cloneElement(children, dataProps);
};
