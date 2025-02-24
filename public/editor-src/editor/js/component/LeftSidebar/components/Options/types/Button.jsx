import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";

export default class DrawerPopoverButton extends React.Component {
  static defaultProps = {
    label: "",
    link: "",
    title: "",
    onClick: noop
  };

  handleClick = (e) => {
    const { onClick, link } = this.props;

    onClick();

    if (link === "") e.preventDefault();
  };

  render() {
    const { className: _className, label, link, title } = this.props;
    const className = classnames("brz-ed-sidebar-bottom__option", _className);

    return (
      <div className={className} title={title}>
        <a
          href={link}
          className="brz-a brz-ed-sidebar__popover__btn"
          onClick={this.handleClick}
        >
          <span className="brz-span">{label}</span>
        </a>
      </div>
    );
  }
}
