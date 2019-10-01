import React from "react";
import classnames from "classnames";
import optionTypes from "./types";

class Option extends React.Component {
  static defaultProps = {
    className: "",
    data: {}
  };

  render() {
    const { data, meta, className: _className } = this.props;
    const Component = optionTypes[data.type];
    const extraProps =
      typeof data.extraProps === "object"
        ? data.extraProps
        : typeof data.extraProps === "function"
        ? data.extraProps()
        : {};
    const className = classnames(
      "brz-ed-sidebar__control__item",
      _className,
      data.className,
      extraProps.className
    );
    const finalProps = {
      ...data,
      ...extraProps,
      meta,
      className
    };
    const element = <Component {...finalProps} />;

    return finalProps.render ? finalProps.render(element) : element;
  }
}

export default Option;
