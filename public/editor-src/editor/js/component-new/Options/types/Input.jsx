import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";
import PopulationSelect from "./common/PopulationSelect";
import PopulationInput from "./common/PopulationInput";

class InputOptionType extends React.Component {
  static defaultProps = {
    className: "",
    label: "",
    placeholder: "",
    helper: false,
    helperContent: "",
    attr: {},
    value: {
      value: "",
      population: ""
    },
    inputType: "text",
    inputSize: "large",
    population: {
      show: false,
      choices: []
    },
    onChange: _.noop
  };

  state = {
    inputValue: this.props.value.value
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value.value !== this.state.inputValue) {
      this.setState({
        inputValue: nextProps.value.value
      });
    }
  }

  onChangeDebounced = _.debounce(value => {
    this.props.onChange(value);
  }, 1000);

  handleInputFocus = () => {
    this.input.focus();
  };

  handleInputChange = event => {
    const {
      inputType,
      value: { population }
    } = this.props;
    const value =
      inputType === "number" ? Number(event.target.value) : event.target.value;

    this.setState({
      inputValue: value
    });
    this.onChangeDebounced({
      changed: "value",
      value,
      population
    });
  };

  handlePopulationChange = value => {
    const { inputValue } = this.state;

    this.props.onChange({
      changed: "population",
      population: value,
      value: inputValue
    });
  };

  handlePopulationClear = () => {
    const { inputValue } = this.state;

    this.props.onChange({
      changed: "population",
      population: "",
      value: inputValue
    });
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
      <div className="brz-ed-option__label brz-ed-option__input__label">
        {label}
        {helper}
      </div>
    );
  }

  renderInput() {
    const { placeholder, inputSize, inputType } = this.props;
    const { inputValue } = this.state;
    const checkedValue =
      inputType === "number" ? Number(inputValue) : String(inputValue);

    return (
      <input
        ref={el => {
          this.input = el;
        }}
        type={inputType}
        className={`brz-input brz-ed-control__input brz-ed-control__input--${inputSize}`}
        placeholder={placeholder}
        value={checkedValue}
        onClick={this.handleInputFocus}
        onChange={this.handleInputChange}
      />
    );
  }

  renderPopulationInput() {
    const {
      population: { choices },
      value: { population },
      inputSize
    } = this.props;
    const { title = "" } = choices.find(el => el.value === population) || {};

    return (
      <PopulationInput
        className={`brz-ed-control__input--${inputSize}`}
        value={title}
        onClear={this.handlePopulationClear}
      />
    );
  }

  renderPopulationSelect() {
    const {
      population: { choices },
      value: { population }
    } = this.props;

    return (
      <PopulationSelect
        defaultValue={population}
        choices={choices}
        onChange={this.handlePopulationChange}
      />
    );
  }

  render() {
    const {
      label,
      className: _className,
      helper,
      attr,
      population,
      value
    } = this.props;
    const className = classnames(
      "brz-ed-option__input",
      "brz-ed-option__inline",
      _className,
      attr.className
    );
    const hasPopulation = population && population.show;
    let content;

    if (hasPopulation) {
      const hasPopulationValue = Boolean(value.population);

      content = (
        <React.Fragment>
          <div className="brz-ed-option__input-container">
            {hasPopulationValue
              ? this.renderPopulationInput()
              : this.renderInput()}
          </div>
          {this.renderPopulationSelect()}
        </React.Fragment>
      );
    } else {
      content = (
        <div className="brz-ed-option__input-container">
          {this.renderInput()}
        </div>
      );
    }

    return (
      <div {...attr} className={className}>
        {(label || helper) && this.renderLabel()}
        {content}
      </div>
    );
  }
}

export default InputOptionType;
