import React from "react";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";

export { Option as SidebarOption } from "./Option";
export { List as SidebarList } from "./List";

export default function Sidebar(props) {
  const { className: _className, children } = props;
  const className = classnames("brz-ed-popup-two-body__sidebar", _className);

  return (
    <div className={className}>
      <ScrollPane
        style={{
          overflow: "hidden",
          height: "100%"
        }}
        className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
      >
        <div className="brz-ed-popup-two-sidebar-body">{children}</div>
      </ScrollPane>
    </div>
  );
}
