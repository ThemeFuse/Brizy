import React, { Component } from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

class Sidebar extends Component {
  static defaultProps = {
    className: "",
    options: [],
    counters: {},
    title: "categories",
    value: "",
    onChange: () => {}
  };

  render() {
    const {
      className: _className,
      options,
      counters,
      title,
      value,
      onChange
    } = this.props;
    const className = classnames("brz-ul brz-ed-popup-two-sidebar", _className);

    return (
      <ul className={className}>
        <div className="brz-ed-popup-two-sidebar-title">{title}</div>
        {options.map(
          ({ id, title, icon }) =>
            counters[id] > 0 && (
              <li
                className={classnames("brz-li brz-ed-popup-two-sidebar-list", {
                  "brz-ed-popup-two-sidebar-list-active": id === value
                })}
                key={id}
                value={id}
                title={title}
                onClick={() => {
                  onChange(id);
                }}
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
              </li>
            )
        )}
      </ul>
    );
  }
}

export default Sidebar;
