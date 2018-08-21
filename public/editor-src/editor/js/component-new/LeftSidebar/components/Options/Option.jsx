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
      data.className,
      _className,
      extraProps.className
    );

    return (
      <Component {...data} {...extraProps} meta={meta} className={className} />
    );
  }
}

export default Option;
