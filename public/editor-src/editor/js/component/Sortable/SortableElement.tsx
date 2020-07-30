import React from "react";

type SortableElementDataAttributes = {
  "data-sortable-element"?: "true";
  "data-sortable-type"?: string;
  "data-sortable-subtype"?: string;
  "data-sortable-use-handle"?: "true";
};
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
  const dataProps: SortableElementDataAttributes = IS_PREVIEW
    ? {}
    : {
        "data-sortable-element": "true",
        "data-sortable-type": type,
        "data-sortable-subtype": subtype,
        "data-sortable-use-handle": useHandle ? "true" : undefined
      };

  return typeof children === "function"
    ? children(dataProps)
    : React.cloneElement(children, dataProps);
};
