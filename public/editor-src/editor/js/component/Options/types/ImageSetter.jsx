import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ImageSetter from "visual/component/Controls/ImageSetter";
import EditorIcon from "visual/component/EditorIcon";
import Population from "./common/Population";

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

  handlePopulationChange = population => {
    const { value, onChange } = this.props;
    onChange({ ...value, population }, { isChanged: "population" });
  };

  renderLabel() {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{ __html: helperContent }}
        />
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__focal-point__label">
        {label}
        {helper}
      </div>
    );
  }

  renderImageSetter = () => {
    const { value, onlyPointer, onChange } = this.props;

    return (
      <ImageSetter {...value} onlyPointer={onlyPointer} onChange={onChange} />
    );
  };

  render() {
    const {
      className: _className,
      label,
      attr,
      display,
      helper,
      population: { choices: populationChoices, show: populationShow },
      value: { population: populationValue }
    } = this.props;
    const className = classnames(
      "brz-ed-option__focal-point",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    const content = populationShow ? (
      <Population
        choices={populationChoices}
        value={populationValue}
        renderUnset={this.renderImageSetter}
        onChange={this.handlePopulationChange}
      />
    ) : (
      this.renderImageSetter()
    );

    return (
      <div {...attr} className={className}>
        {(label || helper) && this.renderLabel()}
        {content}
      </div>
    );
  }
}

export default FocalPointOptionType;
