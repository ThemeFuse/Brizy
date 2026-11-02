import classnames from "classnames";
import React from "react";

export function Option(props) {
  const {
    className: _className = "",
    title = "",
    separator = false,
    children
  } = props;
  const className = classnames("brz-ed-popup-two-sidebar", _className);

  return (
    <div className={className}>
      {title && <div className="brz-ed-popup-two-sidebar-title">{title}</div>}
      {separator && (
        <div className="brz-ed-popup-two-sidebar-separator">{title}</div>
      )}
      {children}
    </div>
  );
}
