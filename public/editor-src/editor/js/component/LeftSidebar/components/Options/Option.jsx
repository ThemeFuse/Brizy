import classnames from "classnames";
import React from "react";
import optionTypes from "./types";
import { getSpecificProps } from "./utils";

class Option extends React.Component {
  static defaultProps = {
    className: "",
    data: {}
  };

  render() {
    const {
      data,
      meta,
      className: _className,
      deviceMode,
      globalConfig,
      setDeviceMode
    } = this.props;
    const Component = optionTypes[data.type];
    const extraProps =
      typeof data.extraProps === "object"
        ? data.extraProps
        : typeof data.extraProps === "function"
          ? data.extraProps({ deviceMode, setDeviceMode })
          : {};
    const className = classnames(
      "brz-ed-sidebar__control__item",
      _className,
      data.className,
      extraProps.className
    );
    const specificProps = getSpecificProps(data.type, this.props);
    const finalProps = {
      ...data,
      ...extraProps,
      ...specificProps,
      meta,
      className,
      globalConfig
    };
    const element = <Component {...finalProps} />;

    return finalProps.render ? finalProps.render(element) : element;
  }
}

export default Option;
