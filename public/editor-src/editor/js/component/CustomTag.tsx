import React, { ReactElement } from "react";

type CustomTagProps = {
  tagName?: keyof JSX.IntrinsicElements;
};

export const CustomTag: React.FC<CustomTagProps> = (
  { tagName, children, ...props },
  ref
): ReactElement => {
  return React.createElement(tagName || "div", { ...props, ref }, children);
};

export default React.forwardRef(CustomTag);
