import React, { Component } from "react";
import classnames from "classnames";

class Link extends Component {
  static defaultProps = {
    className: "",
    href: "",
    target: null,
    type: "external", // external | anchor
    rel: null
  };

  onClick = e => {
    e.preventDefault();
  };

  render() {
    const {
      className: _className,
      type,
      href,
      target,
      children,
      rel,
      ...otherProps
    } = this.props;

    const className = classnames(
      "brz-a",
      {
        "brz-anchor": type === "anchor"
      },
      _className
    );

    const selectedProps = {
      className,
      onClick: this.onClick,
      href: type === "anchor" ? `#${href}` : href,
      target: type === "external" && target === "on" ? "_blank" : null,
      rel: rel === "on" ? "nofollow" : null
    };

    return (
      <a {...otherProps} {...selectedProps}>
        {children}
      </a>
    );
  }
}

export default Link;
