import React from "react";
import classnames from "classnames";

export function Option(props) {
  const { className: _className = "", title = "", children } = props;
  const className = classnames("brz-ed-popup-two-sidebar", _className);

  return (
    <div className={className}>
      <div className="brz-ed-popup-two-sidebar-title">{title}</div>
      {children}
    </div>
  );
}
