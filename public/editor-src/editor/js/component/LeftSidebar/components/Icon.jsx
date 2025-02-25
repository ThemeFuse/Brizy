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
    const { icon, title, className: _className, onClick } = this.props;

    const className = classnames(
      "brz-li brz-ed-sidebar__control__item",
      _className
    );

    return (
      <div className={className} title={title} onClick={onClick}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}
