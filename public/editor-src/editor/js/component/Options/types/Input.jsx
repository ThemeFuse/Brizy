import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import Tooltip from "visual/component/Controls/Tooltip";
import Population from "./common/Population";

const DEBOUNCE_WAIT = 1000;

class InputOptionType extends React.Component {
  static defaultProps = {
    className: "",
    label: "",
    placeholder: "",
    helper: false,
    helperContent: "",
    helperPlacement: "top-center",
    display: "inline",
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

  lastChange = this.props.value.value;

  state = {
    value: this.props.value.value
  };

  isFocused = false;

  componentWillReceiveProps(nextProps) {
    const value = nextProps?.value?.value ?? "";
    if (this.lastChange !== value) {
      this.setState({ value }, () => {
        this.lastChange = this.state.value;
      });
    }
  }

  componentWillUnmount() {
    this.isFocused && this.handleInputBlur();
  }

  handleInputChange = e => {
    const value = e.target.value;

    this.setState({ value }, () => {
      this.debouncedHandleChange();

      // 12.11.2018
      // see how it will go and uncomment if it will
      // be needed to opt out out type === "text"
      // if (this.props.inputType !== "text") {
      //   this.debouncedHandleChange();
      // }
    });
  };

  handlePopulationChange = population => {
    this.setState({ value: "" }, () => {
      const valueExtend = { population };
      const metaExtend = { changed: "population" };

      this.handleChange(valueExtend, metaExtend);
    });
  };

  handleChange = (valueExtend = {}, metaExtend = {}) => {
    const value = {
      value: this.state.value,
      population: this.props.value.population,
      ...valueExtend
    };
    const meta = {
      changed: "value",
      changeEvent: "change",
      ...metaExtend
    };

    this.props.onChange(value, meta);
    this.lastChange = this.state.value;
  };

  debouncedHandleChange = _.debounce(
    (...args) => this.isFocused && this.handleChange(...args),
    DEBOUNCE_WAIT
  );

  handleInputFocus = () => {
    this.isFocused = true;
  };

  handleInputBlur = () => {
    this.isFocused = false;

    if (this.props.value.value !== this.state.value) {
      const valueExtend = {};
      const metaExtend = {
        changed: "value",
        changeEvent: "blur"
      };

      this.handleChange(valueExtend, metaExtend);
    }
  };

  renderLabel() {
    const {
      label,
      helper,
      helperContent,
      helperPlacement,
      population
    } = this.props;

    return (
      <div
        className={classnames(
          "brz-ed-option__label brz-ed-option__input__label",
          {
            "brz-ed-option__input__label--dynamic":
              population && population.show
          }
        )}
      >
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <Tooltip
              placement={helperPlacement}
              openOnClick={false}
              overlay={
                <div
                  className="brz-ed-option__helper__content"
                  dangerouslySetInnerHTML={{ __html: helperContent }}
                />
              }
            >
              <EditorIcon icon="nc-alert-circle-que" />
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  renderInput = () => {
    const { inputSize, inputType, placeholder, population } = this.props;
    const inputClassName = classnames(
      "brz-input brz-ed-control__input",
      `brz-ed-control__input--${inputSize}`,
      { "brz-ed-control__input--dynamic": population && population.show }
    );

    return (
      <input
        className={inputClassName}
        placeholder={placeholder}
        type={inputType}
        value={this.state.value}
        onChange={this.handleInputChange}
        onFocus={this.handleInputFocus}
        onBlur={this.handleInputBlur}
      />
    );
  };

  render() {
    const {
      className: _className,
      helper,
      label,
      display,
      population: { choices: populationChoices, show: populationShow },
      value: { population: populationValue }
    } = this.props;
    const className = classnames(
      "brz-ed-option__input",
      `brz-ed-option__${display}`,
      _className,
      { "brz-ed-option-input--dynamic": populationShow }
    );

    const content = populationShow ? (
      <div className="brz-d-xs-flex brz-align-items-xs-center">
        <Population
          choices={populationChoices}
          value={populationValue}
          renderUnset={this.renderInput}
          onChange={this.handlePopulationChange}
        />
      </div>
    ) : (
      this.renderInput()
    );

    return (
      <div className={className}>
        {(label || helper) && this.renderLabel()}
        {content}
      </div>
    );
  }
}

export default InputOptionType;
