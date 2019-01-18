import React from "react";
import _ from "underscore";
import classnames from "classnames";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";

class InputNumberOptionType extends React.Component {
  static defaultProps = {
    className: "",
    label: "",
    placeholder: "",
    helper: false,
    helperContent: "",
    attr: {},
    min: -9999,
    max: 9999,
    step: 1,
    value: 0,
    onChange: _.noop
  };

  handleInputValueChange = value => {
    this.props.onChange(value);
  };

  renderLabel() {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div className="brz-ed-option__helper__content">{helperContent}</div>
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__input-number__label">
        {label}
        {helper}
      </div>
    );
  }

  render() {
    const {
      className: _className,
      label,
      helper,
      attr,
      min,
      max,
      step,
      value
    } = this.props;
    const className = classnames(
      "brz-ed-option__inline",
      "brz-ed-option__input-number",
      _className,
      attr.className
    );
    const hiddenValue = `${String(value).slice(0, -1)}9`; // changing the last digit to 9 so the width will not glitch

    return (
      <div {...attr} className={className}>
        {(label || helper) && this.renderLabel()}
        <div className="brz-ed-option__input-number-wrap">
          <div className="brz-invisible">{hiddenValue}</div>
          <AutoCorrectingInput
            className="brz-input"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={this.handleInputValueChange}
          />
        </div>
      </div>
    );
  }
}

export default InputNumberOptionType;
