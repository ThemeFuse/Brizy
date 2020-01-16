import React from "react";
import T from "prop-types";

const CustomTag = React.forwardRef(({ tagName, children, ...props }, ref) => {
  return React.createElement(tagName || "div", { ...props, ref }, children);
});

CustomTag.defaultProps = {
  tagName: "div"
};

CustomTag.propTypes = {
  tagName: T.string.isRequired
};

export default CustomTag;
