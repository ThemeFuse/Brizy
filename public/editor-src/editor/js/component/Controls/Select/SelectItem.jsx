import React from "react";
import _ from "underscore";
import classnames from "classnames";

class SelectItem extends React.Component {
  static defaultProps = {
    active: "",
    title: "",
    onClick: _.noop
  };

  getClassName() {
    return classnames("brz-control__select-option", {
      active: this.props.active
    });
  }

  render() {
    const { title, onClick, children } = this.props;

    return (
      <div className={this.getClassName()} title={title} onClick={onClick}>
        {children}
      </div>
    );
  }
}

export default SelectItem;
