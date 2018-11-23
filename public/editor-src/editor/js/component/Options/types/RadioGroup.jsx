import React from "react";
import _ from "underscore";
import classnames from "classnames";
import RadioGroup from "visual/component/Controls/RadioGroup";
import RadioGroupItem from "visual/component/Controls/RadioGroup/RadioGroupItem";
import EditorIcon from "visual/component/EditorIcon";

class RadioGroupOptionType extends React.Component {
  static defaultProps = {
    label: "",
    display: "inline",
    icon: "",
    title: "",
    className: "",
    value: "",
    helper: false,
    helperContent: "",
    attr: {},
    choices: [],
    onChange: _.noop
  };

  renderIcon = icon => {
    return (
      <div className="brz-ed-option__radio-group__icon">
        <EditorIcon icon={icon} />
      </div>
    );
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
      <div className="brz-ed-option__label brz-ed-option__radio-group__label">
        {label}
        {helper}
      </div>
    );
  };

  renderRadioChoices = choices => {
    return choices.map(({ value, title, icon }) => {
      const radioClassName = classnames({
        "brz-ed-option__radio-group--boxed": icon
      });
      return (
        <RadioGroupItem key={value} value={value} className={radioClassName}>
          {icon ? this.renderIcon(icon) : null}
          {title ? this.renderTitle(title) : null}
        </RadioGroupItem>
      );
    });
  };

  renderTitle = title => {
    return <div className="brz-ed-option__radio-group__title">{title}</div>;
  };

  render() {
    const {
      label,
      display,
      className: _className,
      helper,
      choices,
      attr: _attr,
      value,
      onChange
    } = this.props;

    const className = classnames(
      "brz-ed-option__radio-group",
      `brz-ed-option__${display}`,
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        <RadioGroup defaultValue={value} onChange={onChange}>
          {this.renderRadioChoices(choices)}
        </RadioGroup>
      </div>
    );
  }
}

export default RadioGroupOptionType;
