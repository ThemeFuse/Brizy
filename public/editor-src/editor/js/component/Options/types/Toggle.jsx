import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { connect } from "react-redux";
import IconToggle from "visual/component/Controls/IconToggle";
import IconToggleItem from "visual/component/Controls/IconToggle/IconToggleItem";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import { hiddenElementsSelector } from "visual/redux/selectors";

class ToggleOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    closeTooltip: false,
    value: "",
    choices: []
  };

  handleChange = value => {
    const { closeTooltip, showHiddenElements, onChange } = this.props;

    if (value === "off" && closeTooltip && !showHiddenElements) {
      const tooltip = getCurrentTooltip();

      if (tooltip) {
        tooltip.close();
      }
    }

    onChange(value);
  };

  render() {
    const { className: _className, attr, choices, value } = this.props;
    const toggleItems = _.map(choices, ({ icon, value }) => (
      <IconToggleItem key={icon} value={value} icon={icon} />
    ));
    const className = classnames(
      "brz-ed-option__toggle",
      _className,
      attr.className
    );
    const { title: choicesTitle = "" } = choices.filter(
      el => el.value === value
    )[0];

    return (
      <IconToggle
        value={value}
        title={choicesTitle}
        onChange={this.handleChange}
        {...attr}
        className={className}
      >
        {toggleItems}
      </IconToggle>
    );
  }
}

const mapStateToProps = state => ({
  showHiddenElements: hiddenElementsSelector(state)
});

export default connect(mapStateToProps)(ToggleOptionType);
