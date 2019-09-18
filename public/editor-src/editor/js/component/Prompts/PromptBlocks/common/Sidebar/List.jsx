import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

export function List(props) {
  const { lists = [], counters = {}, value = "", onChange = () => {} } = props;

  return lists.map(
    ({ id, title, icon }) =>
      counters[id] > 0 && (
        <div
          key={id}
          title={title}
          className={classnames("brz-ed-popup-two-sidebar-list", {
            "brz-ed-popup-two-sidebar-list-active": id === value
          })}
          onClick={() => onChange(id)}
        >
          {icon && (
            <span className="brz-span brz-ed-popup-two-sidebar-list__span-icon">
              <EditorIcon icon={icon} />
            </span>
          )}
          <span className="brz-span brz-ed-popup-two-sidebar-list__span-text">
            {title}
          </span>
          <span className="brz-span brz-ed-popup-two-sidebar-list__span-new">
            new
          </span>
          <span className="brz-span brz-ed-popup-two-sidebar-list__span-quantity">
            {counters[id]}
          </span>
        </div>
      )
  );
}
