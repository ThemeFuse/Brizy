import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

const validate = v => v !== null && v !== undefined;

export function List(props) {
  const { lists = [], counters = {}, value = "", onChange = () => {} } = props;

  return lists.map(
    ({ id, title, icon }) =>
      validate(counters[id]) && (
        <div
          key={id}
          // usually t is called with a string literal.
          // this works only because the build
          // was customized specifically for this component
          title={t(title)}
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
