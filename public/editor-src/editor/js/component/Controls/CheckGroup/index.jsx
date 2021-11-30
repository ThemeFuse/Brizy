import React from "react";
import _ from "underscore";
import PropTypes from "prop-types";
import classnames from "classnames";

export { default as CheckGroupItem } from "./CheckGroupItem";
export { CheckGroupIcon } from "./CheckGroupIcon";

export default class CheckGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    defaultValue: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    name: "defaultName",
    className: "",
    defaultValue: {},
    onChange: _.noop
  };

  handleChange = value => {
    const { defaultValue, onChange } = this.props;

    onChange({
      ...defaultValue,
      [value]: !defaultValue[value]
    });
  };

  renderOptions() {
    const { defaultValue, children } = this.props;

    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        ...child.props,
        key: index,
        active: Boolean(defaultValue[child.props.value]),
        onClick: child.props.disabled
          ? null
          : () => this.handleChange(child.props.value)
      });
    });
  }

  render() {
    const className = classnames(
      "brz-control__check-group",
      this.props.className
    );

    return <div className={className}>{this.renderOptions()}</div>;
  }
}
