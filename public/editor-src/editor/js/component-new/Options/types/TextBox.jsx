import React from "react";
import _ from "underscore";
import classnames from "classnames";

class TextBoxOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    suffixes: [
      {
        title: "px",
        value: "px"
      }
    ],
    min: -9999,
    max: 9999,
    step: 1,
    value: 0,
    suffixValue: null,
    onChange: _.noop
  };

  constructor(props) {
    super(props);

    const { value, suffixValue } = this.props;

    this.state = { value, suffixValue };
  }

  componentWillReceiveProps({ value, suffixValue }) {
    if (value !== this.state.value || suffixValue !== this.state.suffixValue) {
      this.setState({ value, suffixValue });
    }
  }

  debouncedOnChange = _.debounce(value => {
    this.props.onChange(value);
  }, 1000);

  handleInputRef = el => {
    this.input = el;
  };

  handleInputChange = e => {
    const value = Number(e.target.value);
    const suffixValue = this.state.suffixValue;
    const { min, max } = this.props;

    if (value < min || value > max) {
      return;
    }

    this.input.value = value;
    this.setState({ value });
    this.debouncedOnChange({ value, suffixValue });
  };

  handleSuffixChange = suffixValue => {
    const { value: stateValue, suffixValue: stateSuffixValue } = this.state;

    if (suffixValue === stateSuffixValue) {
      return;
    }

    this.setState({ suffixValue });
    this.props.onChange({ value: stateValue, suffixValue });
  };

  renderSuffix() {
    const { suffixes } = this.props;
    const { suffixValue } = this.state;

    return suffixes.map((suffix, index) => {
      const { title, value } = suffix;
      const className = classnames("brz-ed-option__text-box__helper", {
        "brz-ed-option__text-box__helper--active": value === suffixValue
      });
      const onClick =
        suffixes.length > 1
          ? () => {
              this.handleSuffixChange(value);
            }
          : null;

      return (
        <div key={index} className={className} onClick={onClick}>
          {title}
        </div>
      );
    });
  }

  render() {
    const {
      className: _className,
      attr,
      step,
      min,
      max,
      suffixes
    } = this.props;
    const { value, suffixValue } = this.state;
    const isAutoSize = suffixValue !== null && suffixes.length > 1;
    const className = classnames(
      "brz-ed-option__text-box",
      {
        "brz-ed-option__text-box--auto": isAutoSize
      },
      _className,
      attr.className
    );
    const hiddenValue = `${String(value).slice(0, -1)}9`; // changing the last digit to 9 so the width will not glitch

    return (
      <div {...attr} className={className}>
        <label className="brz-label">
          <div className="brz-ed-option__text-box__input">
            {!isAutoSize && <div className="brz-invisible">{hiddenValue}</div>}
            <input
              ref={this.handleInputRef}
              className="brz-input brz-ed-control__text-box--resizer"
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={this.handleInputChange}
            />
          </div>
          {suffixes.length > 0 && this.renderSuffix()}
        </label>
      </div>
    );
  }
}

export default TextBoxOptionType;
