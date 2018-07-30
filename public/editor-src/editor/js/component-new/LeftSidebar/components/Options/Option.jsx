import React from "react";
import classnames from "classnames";
import optionTypes from "./types";

class Option extends React.Component {
  static defaultProps = {
    className: "",
    data: {}
  };

  render() {
    const { data, className: _className } = this.props;
    const Component = optionTypes[data.type];

    const extraProps =
      typeof data.extraProps === "object"
        ? data.extraProps
        : typeof data.extraProps === "function" ? data.extraProps() : {};

    const className = classnames(
      data.className,
      _className,
      extraProps.className
    );

    return <Component {...data} {...extraProps} className={className} />;
  }
}

export default Option;
