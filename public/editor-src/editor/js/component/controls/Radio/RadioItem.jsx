import _ from "underscore";
import React from "react";
import classnames from "classnames";

export default class RadioItem extends React.Component {
  getClassName = () => {
    return classnames(
      "brz-ed-control-radio-option",
      { active: this.props.active },
      this.props.className
    );
  };

  render() {
    return (
      <div className={this.getClassName()} onClick={this.props.onClick}>
        <i
          className={classnames("brz-ed-control-radio-check", {
            active: this.props.active
          })}
        />
        {this.props.children}
      </div>
    );
  }
}
