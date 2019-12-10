import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import classnames from "classnames";
import { connect } from "react-redux";
import IconToggle from "visual/component/Controls/IconToggle";
import IconToggleItem from "visual/component/Controls/IconToggle/IconToggleItem";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import { showHiddenElementsSelector } from "visual/redux/selectors";

class ToggleOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    closeTooltip: false,
    value: "",
    choices: []
  };

  static propTypes = {
    className: PropTypes.string,
    attr: PropTypes.object,
    closeTooltip: PropTypes.bool,
    value: PropTypes.any,
    choices: PropTypes.array.isRequired
  };

  getTitle() {
    const { choices, value } = this.props;
    const activeChoices = choices.find(el => el.value === value);

    if (!activeChoices) {
      if (process.env.NODE_ENV === "development") {
        throw `cannot find choices {${
          !value ? "__EMPTY VALUE__" : value
        }} from ${JSON.stringify(choices)}`;
      }

      return "";
    }

    return activeChoices.title;
  }

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

    return (
      <IconToggle
        value={value}
        title={this.getTitle()}
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
  showHiddenElements: showHiddenElementsSelector(state)
});

export default connect(mapStateToProps)(ToggleOptionType);
