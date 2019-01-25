import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Slider from "visual/component/Controls/Slider";
import EditorIcon from "visual/component/EditorIcon";
import TextBox from "./TextBox";
import { clamp } from "visual/utils/math";

class SliderOptionType extends React.Component {
  static defaultProps = {
    label: "",
    title: "",
    display: "inline",
    className: "",
    helperContent: "",
    helper: false,
    icon: "",
    attr: {},
    slider: {
      min: 0,
      max: 100,
      step: 1
    },
    input: {
      show: false,
      min: -9999,
      max: 9999,
      step: null
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
    this.handleChange({ value, suffix: suffixValue }, { sliderDragEnd: true });
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

  renderIcon() {
    const { icon, title } = this.props;

    return (
      <div className="brz-ed-option__slider__icon" title={title}>
        <EditorIcon icon={icon} />
      </div>
    );
  }

  renderInput() {
    const defaultProps = this.constructor.defaultProps;
    const props = this.props;
    const {
      suffix: {
        show: suffixShow = defaultProps.suffix.show,
        choices: suffixChoices = defaultProps.suffix.choices
      },
      input: {
        min = defaultProps.input.min != null
          ? defaultProps.input.min
          : props.slider.min != null
          ? props.slider.min
          : defaultProps.slider.min,
        max = defaultProps.input.max != null
          ? defaultProps.input.max
          : props.slider.max != null
          ? props.slider.max
          : defaultProps.slider.max,
        step = defaultProps.input.step != null
          ? defaultProps.input.step
          : props.slider.step != null
          ? props.slider.step
          : defaultProps.slider.step
      }
    } = this.props;
    const { value, suffix: suffixValue } = this.state;

    return (
      <TextBox
        min={Number(min)}
        max={Number(max)}
        step={Number(step)}
        suffixes={suffixShow ? suffixChoices : []}
        suffixValue={suffixShow ? suffixValue : null}
        value={Number(value)}
        onChange={this.handleInputChange}
      />
    );
  }

  render() {
    const defaultProps = this.constructor.defaultProps;
    const {
      className: _className,
      label,
      display,
      slider: {
        min = defaultProps.slider.min,
        max = defaultProps.slider.max,
        step = defaultProps.slider.step
      },
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
          {icon && this.renderIcon()}
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
