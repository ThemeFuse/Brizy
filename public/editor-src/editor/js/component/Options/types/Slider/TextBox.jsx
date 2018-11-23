import React from "react";
import _ from "underscore";
import classnames from "classnames";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";

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
    min: 0,
    max: 0,
    step: 0,
    value: 0,
    suffixValue: null,
    onChange: _.noop
  };

  state = {
    inputText: ""
  };

  inputRef = React.createRef();

  componentDidMount() {
    this.setState({ inputText: this.inputRef.current.getText() });
  }

  componentDidUpdate() {
    // when the input receives new value from props (thus resetting itself)
    // we need to update too
    if (this.state.inputText !== this.inputRef.current.getText()) {
      this.setState({ inputText: this.inputRef.current.getText() });
    }
  }

  handleInputTextChange = text => {
    this.setState({ inputText: text });
  };

  handleInputValueChange = value => {
    const { suffixValue, onChange } = this.props;

    onChange({ value, suffixValue });
  };

  handleSuffixChange = suffixValue => {
    const { value, onChange } = this.props;

    onChange({ value, suffixValue });
  };

  renderSuffix() {
    const { suffixes, suffixValue } = this.props;

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
        <div key={value} className={className} onClick={onClick}>
          {title}
        </div>
      );
    });
  }

  render() {
    const {
      className: _className,
      attr,
      min,
      max,
      step,
      value,
      suffixes,
      suffixValue
    } = this.props;
    const { inputText } = this.state;
    const isFixedWidth = suffixValue !== null && suffixes.length > 1;
    const className = classnames(
      "brz-ed-option__text-box",
      {
        "brz-ed-option__text-box--fixed-width": isFixedWidth
      },
      _className,
      attr.className
    );
    const hiddenValue = `${inputText.slice(0, -1)}9`; // changing the last digit to 9 so the width will not glitch

    return (
      <div {...attr} className={className}>
        <label className="brz-label">
          <div className="brz-ed-option__text-box__input">
            {!isFixedWidth && (
              <div className="brz-invisible">{hiddenValue}</div>
            )}
            <AutoCorrectingInput
              ref={this.inputRef}
              className="brz-input brz-ed-control__text-box--resizer"
              min={min}
              max={max}
              step={step}
              value={value}
              onTextChange={this.handleInputTextChange}
              onChange={this.handleInputValueChange}
            />
          </div>
          {suffixes.length > 0 && this.renderSuffix()}
        </label>
      </div>
    );
  }
}

export default TextBoxOptionType;
