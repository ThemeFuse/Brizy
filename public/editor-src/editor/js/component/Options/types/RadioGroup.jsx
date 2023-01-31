import classnames from "classnames";
import React from "react";
import _ from "underscore";
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

  renderIcon = (icon) => {
    return (
      <div
        className={
          "brz-ed-option__radio-group__icon flex items-center justify-center h-full text-[16px] cursor-pointer transition-[background-color] duration-200 ease-linear delay-[0s]"
        }
      >
        <EditorIcon icon={icon} />
      </div>
    );
  };

  renderLabel = () => {
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
      <div className="brz-ed-option__label brz-ed-option__radio-group__label">
        {label}
        {helper}
      </div>
    );
  };

  renderRadioChoices = (choices) => {
    return choices.map(({ value, title, icon }) => {
      const active = _.isEqual(value, this.props.value);

      const radioClassName = classnames(
        {
          "brz-ed-option__radio-group--boxed w-[37px] h-[30px] border-t-0 border-r border-b-0 border-l-0 border-solid border-r-control-color bg-inkblot text-white overflow-hidden first:rounded-tl-[4px] first:rounded-bl-[4px] [&:nth-last-child(2)]:border-r-0 [&:nth-last-child(2)]:rounded-tr-[4px] [&:nth-last-child(2)]:rounded-br-[4px]":
            icon
        },
        { "bg-brand-primary": active }
      );
      return (
        <RadioGroupItem key={value} value={value} className={radioClassName}>
          {icon ? this.renderIcon(icon) : null}
          {title ? this.renderTitle(title) : null}
        </RadioGroupItem>
      );
    });
  };

  renderTitle = (title) => {
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
