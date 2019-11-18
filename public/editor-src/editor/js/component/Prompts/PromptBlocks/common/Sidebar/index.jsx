import React from "react";
import classnames from "classnames";
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
        backgroundColor: "rgba(129, 138, 145, 0.5)"
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
