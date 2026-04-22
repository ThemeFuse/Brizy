import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";

export default class SidebarIcon extends React.Component {
  static defaultProps = {
    className: "",
    icon: "",
    title: "",
    onClick: noop
  };

  render() {
    const { id, icon, title, active, className: _className, onClick } = this.props;

    const className = classnames(
      "brz-li brz-ed-sidebar__control__item",
      { "brz-ed-sidebar__control__item--active": active },
      _className
    );

    return (
      <div className={className} title={title} onClick={onClick} data-plugin-id={id}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}
