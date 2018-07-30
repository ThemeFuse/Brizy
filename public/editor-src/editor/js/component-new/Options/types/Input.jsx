import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

class InputOptionType extends React.Component {
  static defaultProps = {
    className: "",
    label: "",
    placeholder: "",
    helper: false,
    helperContent: "",
    attr: {},
    value: "",
    inputType: "text",
    inputSize: "large",
    onChange: _.noop
  };

  state = {
    value: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChangeDebounced = _.debounce(value => {
    this.props.onChange(value);
  }, 1000);

  handleChange = event => {
    const value = event.target.value;

    this.setState({ value });
    this.onChangeDebounced(value);
  };

  handleFocus = () => {
    this.input.focus();
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
      <div className="brz-ed-option__label brz-ed-option__input__label">
        {label}
        {helper}
      </div>
    );
  };

  render() {
    const {
      label,
      className: _className,
      helper,
      placeholder,
      attr: _attr,
      inputType,
      inputSize
    } = this.props;
    const { value } = this.state;
    const className = classnames(
      "brz-ed-option__input",
      "brz-ed-option__inline",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");
    const checkedValue = inputType === "number" ? Number(value) : String(value);

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        <input
          ref={el => {
            this.input = el;
          }}
          type={inputType}
          className={`brz-input brz-ed-control__input brz-ed-control__input--${inputSize}`}
          placeholder={placeholder}
          value={checkedValue}
          onClick={this.handleFocus}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default InputOptionType;
