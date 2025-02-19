import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";

export default class DrawerPopoverItem extends React.Component {
  static defaultProps = {
    className: "",
    label: "",
    icon: "",
    link: "",
    linkTarget: "",
    title: "",
    onClick: noop
  };

  handleClick = (e) => {
    const { link, meta = {}, onClick } = this.props;

    if ((link === "" || link === "#") && meta.popover) {
      meta.popover.close();
    }

    onClick(e);
  };

  render() {
    const {
      className: _className,
      icon,
      label,
      link,
      linkTarget,
      title
    } = this.props;

    const className = classnames("brz-ed-sidebar-bottom__option", _className);

    const content = (_className = "") => (
      <div
        {...(_className ? { className: _className } : {})}
        title={title}
        onClick={this.handleClick}
      >
        {icon && <EditorIcon icon={icon} />}
        {label && <span className="brz-span">{label}</span>}
      </div>
    );

    return link !== "" ? (
      <a
        href={link}
        target={linkTarget}
        className={classnames("brz-a", className)}
      >
        {content()}
      </a>
    ) : (
      content(className)
    );
  }
}
