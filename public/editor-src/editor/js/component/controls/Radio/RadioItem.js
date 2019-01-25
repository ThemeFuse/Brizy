import React from "react";
import classnames from "classnames";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";

export default class RadioItem extends React.Component {
  static defaultProps = {
    className: "",
    active: false,
    onClick: _.noop
  };

  render() {
    const { active, className: _className, children, onClick } = this.props;
    const className = classnames(
      "brz-ed-control-radio-option",
      { "brz-ed-control-radio-option--active": active },
      _className
    );
    const iconClassName = classnames("brz-ed-control-radio-check", {
      "brz-ed-control-radio-check--active": active
    });

    return (
      <div className={className} onClick={onClick}>
        <EditorIcon
          className={iconClassName}
          icon={active ? "nc-check" : "nc-uncheck"}
        />
        {children}
      </div>
    );
  }
}
