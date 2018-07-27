import React from "react";
import _ from "underscore";
import classnames from "classnames";
import IconToggle from "visual/component/controls/IconToggle";
import IconToggleItem from "visual/component/controls/IconToggle/IconToggleItem";

class ToggleOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    value: "",
    choices: []
  };

  render() {
    const {
      className: _className,
      attr: _attr,
      choices,
      value,
      onChange
    } = this.props;
    const toggleItems = _.map(choices, ({ icon, value }) => (
      <IconToggleItem key={icon} value={value} icon={icon} />
    ));
    const className = classnames(
      "brz-ed-option__toggle",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");
    const { title: choicesTitle = "" } = choices.filter((el) => el.value === value)[0];

    return (
      <IconToggle
        className={className}
        value={value}
        title={choicesTitle}
        onChange={onChange}
        {...attr}
      >
        {toggleItems}
      </IconToggle>
    );
  }
}

export default ToggleOptionType;
