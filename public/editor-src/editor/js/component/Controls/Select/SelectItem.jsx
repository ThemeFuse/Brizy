import classnames from "classnames";
import { noop } from "es-toolkit";
import T from "prop-types";
import React from "react";

class SelectItem extends React.Component {
  static propTypes = {
    active: T.bool,
    selected: T.bool,
    title: T.string,
    disabled: T.bool,
    value: T.oneOfType([T.string, T.number]),
    onClick: T.func
  };

  static defaultProps = {
    active: false,
    selected: false,
    title: "",
    disabled: false,
    value: "",
    onClick: noop
  };

  getClassName() {
    return classnames("brz-control__select-option", {
      active: this.props.active,
      disabled: this.props.disabled
    });
  }

  render() {
    const { title, disabled, onClick, value, children } = this.props;
    const fn = disabled ? () => {} : onClick;

    return (
      <div
        className={this.getClassName()}
        title={title}
        data-value={value}
        onClick={fn}
      >
        {children}
      </div>
    );
  }
}

export default SelectItem;
