import classnames from "classnames";
import React from "react";

export default class RadioItem extends React.Component {
  render() {
    const { className: _className, active, children, onClick } = this.props;
    const className = classnames(
      "brz-control__radio-option",
      { active },
      _className
    );

    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }
}
