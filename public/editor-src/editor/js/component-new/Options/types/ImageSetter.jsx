import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ImageSetter from "visual/component/controls/ImageSetter";
import EditorIcon from "visual/component-new/EditorIcon";
import PopulationSelect from "./common/PopulationSelect";
import PopulationInput from "./common/PopulationInput";

class FocalPointOptionType extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    attr: {},
    helper: false,
    helperContent: "",
    onlyPointer: false,
    display: "inline",
    population: {
      show: false,
      choices: []
    },
    value: {},
    onChange: _.noop
  };

  handlePopulationChange = value => {
    this.props.onChange({ population: value });
  };

  handlePopulationClear = () => {
    const { value, onChange } = this.props;
    onChange({ ...value, population: "" });
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
      <div className="brz-ed-option__label brz-ed-option__focal-point__label">
        {label}
        {helper}
      </div>
    );
  }

  renderImageSetter() {
    const { value, onlyPointer, onChange } = this.props;

    return (
      <ImageSetter {...value} onlyPointer={onlyPointer} onChange={onChange} />
    );
  }

  renderPopulationInput() {
    const {
      population: { choices },
      value: { population }
    } = this.props;
    const { title = "" } = choices.find(el => el.value === population) || {};

    return (
      <PopulationInput value={title} onClear={this.handlePopulationClear} />
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
      className: _className,
      label,
      attr,
      display,
      value,
      helper,
      population
    } = this.props;
    const className = classnames(
      "brz-ed-option__focal-point",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );
    const hasPopulation = population && population.show;
    let content;

    if (hasPopulation) {
      const hasPopulationValue = Boolean(value.population);

      content = (
        <React.Fragment>
          {hasPopulationValue
            ? this.renderPopulationInput()
            : this.renderImageSetter()}
          {this.renderPopulationSelect()}
        </React.Fragment>
      );
    } else {
      content = this.renderImageSetter();
    }

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        {content}
      </div>
    );
  }
}

export default FocalPointOptionType;
