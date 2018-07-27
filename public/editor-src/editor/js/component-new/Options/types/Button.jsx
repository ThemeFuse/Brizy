import React from "react";
import _ from "underscore";
import classNames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

class ButtonOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-circle-add",
    title: "Add",
    value: false
  };

  handleMouseDown = event => {
    event.preventDefault();

    this.props.onChange(!this.props.value);
  };

  render() {
    const { className: _className, attr: _attr, value, icon, title } = this.props;
    const className = classNames(
      "brz-ed-option__button",
      {
        "brz-ed-toolbar--active": value
      },
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} title={title} onMouseDown={this.handleMouseDown} {...attr}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}

export default ButtonOptionType;
