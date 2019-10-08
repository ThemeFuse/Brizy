import React from "react";
import _ from "underscore";
import classnames from "classnames";

class SelectItem extends React.Component {
  static defaultProps = {
    active: "",
    title: "",
    disabled: false,
    onClick: _.noop
  };

  getClassName() {
    return classnames("brz-control__select-option", {
      active: this.props.active,
      disabled: this.props.disabled
    });
  }

  render() {
    const { title, disabled, onClick, children } = this.props;
    const fn = disabled ? () => {} : onClick;

    return (
      <div className={this.getClassName()} title={title} onClick={fn}>
        {children}
      </div>
    );
  }
}

export default SelectItem;
