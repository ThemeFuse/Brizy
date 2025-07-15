import classnames from "classnames";
import React from "react";
import Scrollbars from "react-custom-scrollbars";

export { Option as SidebarOption } from "./Option";
export { List as SidebarList } from "./List";

export default function Sidebar(props) {
  const { className: _className, children } = props;
  const className = classnames("brz-ed-popup-two-body__sidebar", _className);
  const renderThumbs = ({ style, ...props }) => (
    <div
      {...props}
      style={{
        ...style,
        borderRadius: "inherit",
        backgroundColor: "var(--toolbars-icons-separators, #3f4652)"
      }}
    />
  );

  return (
    <div className={className}>
      <Scrollbars
        renderThumbHorizontal={renderThumbs}
        renderThumbVertical={renderThumbs}
      >
        <div className="brz-ed-popup-two-sidebar-body">{children}</div>
      </Scrollbars>
    </div>
  );
}
