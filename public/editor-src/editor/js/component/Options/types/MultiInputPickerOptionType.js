import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";

class MultiInputPickerOptionType extends React.Component {
  static defaultProps = {
    className: "",
    display: "inline",
    icon: "nc-combined-shape",
    label: "Size",
    min: -9999,
    max: 9999,
    step: 1,
    attr: {},
    value: {
      type: "grouped", // type = grouped, ungrouped
      grouped: [],
      ungrouped: []
    },
    onChange: _.noop
  };

  handleClick = () => {
    const {
      value: { type, grouped, ungrouped },
      onChange
    } = this.props;

    onChange({
      type: type === "grouped" ? "ungrouped" : "grouped",
      grouped,
      ungrouped,
      isChanged: "type",
      isChangedIndex: 0
    });
  };

  handleInputValueChange = (index, v) => {
    const {
      value: { type, grouped, ungrouped },
      onChange
    } = this.props;
    const options = this.props.value[type];
    const updated = options.map((v_, index_) => (index_ === index ? v : v_));

    onChange({
      type,
      grouped: type === "grouped" ? updated : grouped,
      ungrouped: type === "ungrouped" ? updated : ungrouped,
      isChanged: "value",
      isChangedIndex: index
    });
  };

  render() {
    const {
      className: _className,
      attr,
      min,
      max,
      step,
      value: { type },
      label,
      display,
      icon
    } = this.props;
    const className = classnames(
      "brz-ed-option__multi-border",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    const buttonClassName = classnames("brz-button", {
      "brz-ed-option__multi-border--active": type === "grouped"
    });

    return (
      <div {...attr} className={className}>
        <div className="brz-label">{label}</div>
        {this.props.value[type].map((v, index) => (
          <AutoCorrectingInput
            className="brz-input brz-ed-option__multi-input"
            key={index}
            min={min}
            max={max}
            step={step}
            value={v}
            onChange={v => this.handleInputValueChange(index, v)}
          />
        ))}
        <button className={buttonClassName} onClick={this.handleClick}>
          <EditorIcon icon={icon} className="brz-icon" />
        </button>
      </div>
    );
  }
}

export default MultiInputPickerOptionType;
