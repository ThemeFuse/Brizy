import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import classnames from "classnames";

export default class CheckGroupItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    className: "",
    active: false,
    value: "",
    name: "",
    onClick: _.noop
  };

  render() {
    const {
      className: _className,
      name,
      active,
      value,
      children,
      onClick
    } = this.props;
    const className = classnames(
      "brz-ed-control__check-group-option",
      { active },
      _className
    );

    return (
      <div className={className} onClick={onClick}>
        {children}
        <input className="brz-input" type="hidden" name={name} value={value} />
      </div>
    );
  }
}
