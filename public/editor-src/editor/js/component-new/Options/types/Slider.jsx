import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Slider from "visual/component/controls/Slider";
import EditorIcon from "visual/component-new/EditorIcon";
import TextBox from "./TextBox";
import { clamp } from "visual/utils/math";

class SliderOptionType extends React.Component {
  static defaultProps = {
    label: "",
    display: "inline",
    className: "",
    helperContent: "",
    helper: false,
    icon: "",
    attr: {},
    slider: {
      min: 1,
      max: 100,
      step: 1
    },
    input: {
      show: false,
      min: -9999,
      max: 9999
    },
    suffix: {
      show: false,
      choices: []
    },
    value: {
      value: 0,
      suffix: null
    },
    onChange: _.noop
  };

  constructor(props) {
    super(props);
    const value = props.value;
    this.state = { ...value };
  }

  componentWillReceiveProps({ value }) {
    if (
      value.value !== this.state.value ||
      value.suffix !== this.state.suffix
    ) {
      this.setState({ ...value });
    }
  }

  handleSliderChange = value => {
    this.handleChange({ value }, { sliderDragEnd: false });
  };

  handleSliderChangeEnd = value => {
    this.handleChange({ value }, { sliderDragEnd: true });
  };

  handleInputChange = ({ value, suffixValue }) => {
    this.handleChange({ value, suffix: suffixValue }, { sliderDragEnd: false });
  };

  handleChange = (value, others) => {
    const { onChange } = this.props;
    const oldValue = this.state;
    const newValue = { ...oldValue, ...value };

    this.setState(newValue);

    onChange(newValue, others);
  };

  renderLabel() {
    const { label, helper, helperContent } = this.props;

    return (
      <div className="brz-ed-option__label brz-ed-option__slider__label">
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div className="brz-ed-option__helper__content">
              {helperContent}
            </div>
          </div>
        )}
      </div>
    );
  }

  renderIcon(icon) {
    return (
      <div className="brz-ed-option__slider__icon">
        <EditorIcon icon={icon} />
      </div>
    );
  }

  renderInput() {
    const {
      step,
      suffix: { show: suffixShow = false, choices: suffixChoices },
      input: { min = -9999, max = 9999 }
    } = this.props;
    const { value, suffix } = this.state;

    return (
      <TextBox
        min={min}
        max={max}
        step={step}
        suffixes={suffixShow ? suffixChoices : []}
        suffixValue={suffixShow ? suffix : null}
        value={value}
        onChange={this.handleInputChange}
      />
    );
  }

  render() {
    const {
      className: _className,
      label,
      display,
      slider: { min = 0, max = 100, step = 1 },
      input,
      suffix,
      helper,
      attr: _attr,
      icon
    } = this.props;
    const className = classnames(
      "brz-ed-option__slider",
      `brz-ed-option__${display}`,
      { "brz-ed-option__slider-suffix": suffix.length > 0 },
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");
    const sliderValue = clamp(this.state.value, min, max);

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        <div className="brz-ed-option__slider__content">
          {icon && this.renderIcon(icon)}
          <Slider
            id={this.props.id}
            min={Number(min)}
            max={Number(max)}
            step={Number(step)}
            value={Number(sliderValue)}
            onChange={this.handleSliderChange}
            onChangeEnd={this.handleSliderChangeEnd}
          />
          {input.show && this.renderInput()}
        </div>
      </div>
    );
  }
}

export default SliderOptionType;
