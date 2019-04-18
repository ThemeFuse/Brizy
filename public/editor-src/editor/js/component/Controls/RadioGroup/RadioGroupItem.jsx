import React from "react";
import _ from "underscore";
import classnames from "classnames";

export default class RadioGroupItem extends React.Component {
  static defaultProps = {
    className: "",
    active: null,
    value: null,
    onClick: _.noop
  };

  getClassName = () => {
    const { className, active } = this.props;
    return classnames(
      "brz-ed-control__radio-group-option",
      { active },
      className
    );
  };

  render() {
    return (
      <div className={this.getClassName()} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}
