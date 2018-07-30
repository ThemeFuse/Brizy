import React from "react";
import _ from "underscore";
import classnames from "classnames";
import StepperControl from "visual/component/controls/Stepper";
import EditorIcon from "visual/component-new/EditorIcon";

class StepperOptionType extends React.Component {
  static defaultProps = {
    label: "",
    display: "inline",
    min: 0,
    max: 10,
    step: 1,
    value: 5,
    className: "",
    attr: {},
    helper: false,
    helperContent: "",
    onChange: _.noop
  };

  renderLabel = () => {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div className="brz-ed-option__helper__content">{helperContent}</div>
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__stepper__label">
        {label}
        {helper}
      </div>
    );
  };

  render() {
    const {
      label,
      display,
      min,
      max,
      step,
      helper,
      value,
      className: _className,
      attr: _attr,
      onChange
    } = this.props;
    const className = classnames(
      "brz-ed-option__stepper",
      `brz-ed-option__${display}`,
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        <StepperControl
          value={Number(value)}
          min={Number(min)}
          max={Number(max)}
          step={Number(step)}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default StepperOptionType;
