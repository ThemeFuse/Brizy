import React, { Component } from "react";
import classnames from "classnames";

class Link extends Component {
  static defaultProps = {
    className: "",
    style: null,
    href: "",
    target: null,
    type: "external", // external | anchor | lightBox | popup
    rel: null
  };

  handleClick = e => {
    e.preventDefault();
  };

  getClassName() {
    const { className, type } = this.props;

    return classnames("brz-a", { "brz-anchor": type === "anchor" }, className);
  }

  getHref() {
    const { type, href: _href } = this.props;
    let href;

    switch (type) {
      case "anchor":
      case "popup":
        href = `#${_href}`;
        break;
      case "lightBox":
      case "external":
        href = _href;
        break;
      default:
        throw new Error(`unknown link type ${type}`);
    }

    return href;
  }

  getRel() {
    return this.props.rel === "on" ? "nofollow" : null;
  }

  getTarget() {
    const { type, target } = this.props;

    return type === "external" && target === "on" ? "_blank" : null;
  }

  render() {
    const { type, style, children } = this.props;
    const className = this.getClassName();
    const href = this.getHref();
    const target = this.getTarget();
    const rel = this.getRel();

    return (
      <a
        className={className}
        href={href}
        target={target}
        rel={rel}
        style={style}
        data-brz-link-type={type}
        onClick={this.handleClick}
      >
        {children}
      </a>
    );
  }
}

export default Link;
