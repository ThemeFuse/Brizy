import classnames from "classnames";
import React from "react";
import { Scrollbar } from "visual/component/Scrollbar";

export { Option as SidebarOption } from "./Option";
export { List as SidebarList } from "./List";

export default function Sidebar(props) {
  const { className: _className, children } = props;
  const className = classnames("brz-ed-popup-two-body__sidebar", _className);

  return (
    <div className={className}>
      <Scrollbar absolute>
        <div className="brz-ed-popup-two-sidebar-body">{children}</div>
      </Scrollbar>
    </div>
  );
}
