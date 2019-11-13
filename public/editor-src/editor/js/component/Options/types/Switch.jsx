import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { connect } from "react-redux";
import SwitchControl from "visual/component/Controls/Switch";
import EditorIcon from "visual/component/EditorIcon";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import { showHiddenElementsSelector } from "visual/redux/selectors";

class SwitchOptionType extends React.Component {
  static defaultProps = {
    label: "",
    display: "inline",
    className: "",
    closeTooltip: false,
    value: "off",
    valueMap: {
      true: "on",
      false: "off"
    },
    attr: {},
    helper: false,
    helperContent: "",
    onChange: _.noop
  };

  handleChange = value => {
    const { closeTooltip, showHiddenElements, onChange } = this.props;

    if (value === "off" && closeTooltip && !showHiddenElements) {
      const tooltip = getCurrentTooltip();

      if (tooltip && tooltip.state.isOpen) {
        tooltip.close();
      }
    }

    onChange(value);
  };
  renderLabel() {
    const { label, helper, helperContent } = this.props;

    return (
      <div className="brz-ed-option__label brz-ed-option__switch__label">
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div
              className="brz-ed-option__helper__content"
              dangerouslySetInnerHTML={{ __html: helperContent }}
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      label,
      display,
      helper,
      value,
      valueMap,
      attr,
      className: _className
    } = this.props;
    const className = classnames(
      "brz-ed-option__switch",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel(label) : null}
        <SwitchControl
          key={value}
          defaultValue={value}
          valueMap={valueMap}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showHiddenElements: showHiddenElementsSelector(state)
});

export default connect(mapStateToProps)(SwitchOptionType);
