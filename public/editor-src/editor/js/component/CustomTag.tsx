import React, { PropsWithChildren, ReactElement, Ref } from "react";

type CustomTagProps = PropsWithChildren<{
  tagName?: keyof JSX.IntrinsicElements;
}>;

export const CustomTag = (
  { tagName, children, ...props }: CustomTagProps,
  ref: Ref<Element>
): ReactElement => {
  return React.createElement(tagName || "div", { ...props, ref }, children);
};

export default React.forwardRef(CustomTag);
