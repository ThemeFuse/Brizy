import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Select from "visual/component/controls/Select";
import SelectItem from "visual/component/controls/Select/SelectItem";
import EditorIcon from "visual/component-new/EditorIcon";

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
    inputValue: this.props.value.value,
    populationValue: this.props.value.population
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.value.value !== this.state.inputValue ||
      nextProps.value.population !== this.state.populationValue
    ) {
      this.setState({
        inputValue: nextProps.value.value,
        populationValue: nextProps.value.population
      });
    }
  }

  onChangeDebounced = _.debounce(value => {
    this.props.onChange(value);
  }, 1000);

  handleChange = event => {
    const value = event.target.value;
    const { populationValue } = this.state;

    this.setState({
      inputValue: value
    });
    this.onChangeDebounced({
      changed: "value",
      value,
      population: populationValue
    });
  };

  handlePopulationChange = value => {
    const { inputValue } = this.state;

    this.setState({
      populationValue: value
    });
    this.props.onChange({
      changed: "population",
      population: value,
      value: inputValue
    });
  };

  handleRemovePopulation = () => {
    const { inputValue } = this.state;

    this.setState({
      populationValue: ""
    });
    this.props.onChange({
      changed: "population",
      population: "",
      value: inputValue
    });
  };

  handleFocus = () => {
    this.input.focus();
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

  renderPopulation() {
    const {
      population: { choices },
      value: { population }
    } = this.props;
    const selectChoices = choices.map((item, index) => {
      const { title, icon, value } = item;

      return (
        <SelectItem key={index} value={value} title={title}>
          {icon && <EditorIcon icon={icon} />}
          <span className="brz-span">{title}</span>
        </SelectItem>
      );
    });
    const className = classnames(
      "brz-control__select--dark",
      "brz-control__select__auto",
      "brz-control__select-population",
      { "brz-control__select--active": population }
    );

    return (
      <Select
        className={className}
        defaultValue={population}
        itemHeight={30}
        labelType="icon"
        labelIcon="nc-dynamic"
        onChange={this.handlePopulationChange}
      >
        {selectChoices}
      </Select>
    );
  }

  render() {
    const {
      label,
      className: _className,
      helper,
      placeholder,
      inputSize,
      inputType,
      attr,
      population
    } = this.props;
    const className = classnames(
      "brz-ed-option__input",
      "brz-ed-option__inline",
      _className,
      attr.className
    );
    const hasPopulation = population && population.show;
    const { inputValue, populationValue } = this.state;
    const checkedValue =
      inputType === "number" ? Number(inputValue) : String(inputValue);

    let content = (
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
    );

    if (populationValue) {
      const { choices } = this.props.population;
      const { title = "" } =
        choices.find(el => el.value === populationValue) || {};

      content = (
        <React.Fragment>
          <input
            disabled
            type="text"
            className={`brz-input brz-ed-control__input brz-ed-control__input--${inputSize}`}
            value={title}
          />
          <EditorIcon
            icon="nc-circle-remove"
            onClick={this.handleRemovePopulation}
          />
        </React.Fragment>
      );
    }

    return (
      <div {...attr} className={className}>
        {(label || helper) && this.renderLabel()}
        <div className="brz-ed-option__input-container">{content}</div>
        {hasPopulation && this.renderPopulation()}
      </div>
    );
  }
}

export default InputOptionType;
