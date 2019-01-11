import React, { Component } from "react";
import classnames from "classnames";
import { getBlockById } from "visual/utils/blocks";

class Link extends Component {
  static defaultProps = {
    className: "",
    style: null,
    href: "",
    target: null,
    type: "external", // external | anchor | lightBox | popup
    rel: null,
    attr: {
      title: ""
    }
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
        if (IS_EDITOR) {
          href = `#${_href}`;
        } else {
          const block = getBlockById(_href);
          const anchorName = (block && block.value.anchorName) || _href;
          href = `#${anchorName}`;
        }
        break;
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

  getAttr() {
    const { attr } = this.props;

    return Object.keys(attr)
      .filter(key => attr[key] !== "")
      .reduce((obj, key) => {
        obj[key] = attr[key];
        return obj;
      }, {});
  }

  render() {
    const { type, style, children } = this.props;
    const className = this.getClassName();
    const href = this.getHref();
    const target = this.getTarget();
    const rel = this.getRel();
    const attr = this.getAttr();

    return (
      <a
        className={className}
        href={href}
        target={target}
        rel={rel}
        style={style}
        data-brz-link-type={type}
        onClick={this.handleClick}
        {...attr}
      >
        {children}
      </a>
    );
  }
}

export default Link;
